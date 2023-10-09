// services/authService.js
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const randomstring = require("randomstring");

const avatars = {
  male: ["avatar_5", "avatar_12", "avatar_13", "avatar_14", "avatar_15", "avatar_18"],
  female: ["avatar_23", "avatar_8", "avatar_16", "avatar_20"],
};

const randomAvatar = (gender) => {
  const avatarsList = avatars[gender];
  const randomIndex = Math.floor(Math.random() * avatarsList.length);
  return avatarsList[randomIndex];
};

const authService = {
  register: async (userData) => {
    try {
      const { firstName, lastName, mail, password, role, gender } = userData;

      const emailExist = await User.findOne({ user_Mail: mail });
      if (emailExist) throw new Error("Email already exists");

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const secretToken = randomstring.generate();

      const user = new User({
        user_First_Name: firstName,
        user_Last_Name: lastName,
        user_Mail: mail,
        user_Password: hashedPassword,
        active: false,
        role,
        gender,
        token: null,
        newsletters: [],
        avatar: randomAvatar(gender),
      });

      await user.save();
    } catch (error) {
      throw error;
    }
  },

  loginUser: async (mail, password) => {
    try {
      const user = await User.findOne({ user_Mail: mail });

      if (!user) {
        throw new Error("E-mail is invalid");
      }

      const isMatch = await bcrypt.compare(password, user.user_Password);

      if (!isMatch) {
        throw new Error("Password is wrong");
      }

      const token = jwt.sign({ data: user._id }, "Hakona_Matata", {
        expiresIn: "72h",
      });

      return { token, user };
    } catch (error) {
      throw error;
    }
  },

  newPasword: async (secretcode, password) => {
    try {
      const salt = await bcrypt.genSalt(10);
      const token = await bcrypt.hash(password, salt);
      await User.updateOne(
        { secretToken: secretcode },
        {
          $set: {
            password: token,
          },
        }
      );
    } catch (error) {
      throw error;
    }
  },

  updatePassword: async (id, password) => {
    try {
      const salt = await bcrypt.genSalt(10);
      const token = await bcrypt.hash(password, salt);
      await User.findByIdAndUpdate(
        { _id: id },
        {
          $set: {
            password: token,
          },
        }
      );
    } catch (error) {
      throw error;
    }
  },

  verify: async (secretToken) => {
    try {
      const user = await User.findOne({ secretToken });

      if (!user) {
        throw new Error("Wrong secret code");
      }

      if (user.active) {
        throw new Error("User already active");
      }

      user.active = true;
      await user.save();

      return user;
    } catch (error) {
      throw error;
    }
  },

  requireAuth: (req, res, next) => {
    if (!req.session || !req.session.token || !req.session.user) {
      return res.status(401).json({ message: "Unauthorized 🚫" });
    }

    // If authentication is successful, call the next middleware function
    next();
  },

  logout: async () => {
    try {
      // Clear cookie or perform any logout-related tasks
    } catch (error) {
      throw error;
    }
  },
};

module.exports = authService;

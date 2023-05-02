const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mailer = require("../middleware/mailer");
const randomstring = require("randomstring");
const session = require("express-session");

module.exports = {
  async register(req, res) {
    const avatars = {
      male: [
        "avatar_5",
        "avatar_12",
        "avatar_13",
        "avatar_14",
        "avatar_15",
        "avatar_18",
      ],
      female: ["avatar_23", "avatar_8", "avatar_16", "avatar_20"],
    };

    const randomAvatar = (gender) => {
      const avatarsList = avatars[gender];
      const randomIndex = Math.floor(Math.random() * avatarsList.length);
      return avatarsList[randomIndex];
    };
    try {
      const emailExist = await User.findOne({ user_Mail: req.body.mail });
      if (emailExist) return res.status(400).send("Email already exists");
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      const secretToken = randomstring.generate();
      const user = new User({
        user_First_Name: req.body.firstName,
        user_Last_Name: req.body.lastName,
        user_Mail: req.body.mail,
        user_Password: hashedPassword,
        active: false,
        role: req.body.role,
        gender: req.body.gender,
        token: null,
        newsletters: [],
        avatar: randomAvatar(req.body.gender),
      });

      await user.save();

      res.status(200).send("User registered successfully!");
    } catch (err) {
      res.status(400).send("Server Error: " + err);
    }
  },
  async initialize(req, res) {
    res.status(200).send("Initiatiaized!");
  },

  async loginUser(req, res) {
    try {
      const { mail, password } = req.body;

      if (!mail || !password) {
        console.log("No empty fields allowed 🛑");
        return res.status(400).json({ message: "No empty fields allowed 🛑" });
      }

      const user = await User.findOne({ user_Mail: mail });

      if (!user) {
        console.log("E-mail is invalid 🛑");
        return res.status(400).json({ message: "E-mail is invalid 🛑" });
      }

      const isMatch = await bcrypt.compare(password, user.user_Password);

      if (!isMatch) {
        console.log("Password is wrong 🛑");
        return res.status(400).json({ message: "Password is wrong 🛑" });
      }

      const token = jwt.sign({ data: user }, "Hakona_Matata", {
        expiresIn: "72h",
      });

      res.cookie("token", token, {
        httpOnly: true,
        maxAge: 86400000, // 24 hours
        secure: true, // set the 'secure' flag to true if you're using HTTPS
        sameSite: "none", // set this flag to 'strict' to prevent CSRF attacks and steer away from the nasty hacker after setting up same origin
      });

      return res.status(200).json({ message: "login successful", user, token });

      // this is used for the session
      // req.session.token = token;
      // req.session.user = user;
    } catch (error) {
      console.log(error);
      return res.status(400).json({ message: error.message });
    }
  },

  async newPasword(req, res) {
    console.log(req.body);
    try {
      const salt = await bcrypt.genSalt(10);
      const token = await bcrypt.hash(req.body.password, salt);
      await User.updateOne(
        { secretToken: req.body.secretcode },
        {
          $set: {
            password: token,
          },
        }
      );
      res.status(200).json({ message: "Passowrd updated successfully" });
    } catch (err) {
      res.status(400).json({ message: "error ouccured", err });
    }
  },

  async updatePassword(req, res) {
    try {
      const salt = await bcrypt.genSalt(10);
      const token = await bcrypt.hash(req.body.password, salt);
      await User.findByIdAndUpdate(
        { _id: req.body.id },
        {
          $set: {
            password: token,
          },
        }
      );
      res.status(200).json({ message: "Passowrd updated successfully" });
    } catch (error) {
      res.status(400).json({ message: "error ouccured", error });
    }
  },

  async verify(req, res) {
    try {
      const { secretToken } = req.body;
      const user = await User.findOne({ secretToken });
      console.log(secretToken);
      if (!user) return res.status(400).send("Wrong secret code");
      if (user.active) return res.status(400).send("User already active");
      user.active = true;
      await user.save();
      console.log(user);
      res.status(200).send(user);
    } catch (err) {
      res.status(400).send("Error occurred");
    }
  },

  async requireAuth(req, res, next) {
    if (!req.session || !req.session.token || !req.session.user) {
      return res.status(401).json({ message: "Unauthorized 🚫" });
    }

    // If authentication is successful, call the next middleware function
    next();
  },


  async logout(req, res) {
    try {
      res.clearCookie('jwt');

      res.status(200).send('Logged out successfully.');
    }
    catch (err) {
      res.status(400).send("Error occurred");
    }
  },


  /*   async forgotPassword(req, res) {
      try {
        const user = await User.findOne({ mail: req.body.mail });
        if (!user) {
          res.status(400).send("Email does not exist");
        } else {
          const html = `<h1>Hello ${user.userName}</h1><hr><br/>
                        <h3>Click on the link to reset your password:</h3> 
                        <a href="http://localhost:3000/auth/forgot/${user.secretToken}">http://localhost:3000/auth/forgot/${user.secretToken}</a>
                        <hr>`;
          await mailer.sendEmail(
            "verify@poutcha.com",
            user.mail,
            "Please verify your account",
            html
          );
          res.json(user);
        }
      } catch (err) {
        res.status(400).send("Error occurred");
      }
    }, */
};

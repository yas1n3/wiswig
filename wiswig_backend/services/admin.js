const User = require("../models/user");
const bcrypt = require("bcryptjs");

const avatars = {
  male: ["avatar_5", "avatar_12", "avatar_13", "avatar_14", "avatar_15", "avatar_18"],
  female: ["avatar_23", "avatar_8", "avatar_16", "avatar_20"],
};

const randomAvatar = (gender) => {
  const avatarsList = avatars[gender];
  const randomIndex = Math.floor(Math.random() * avatarsList.length);
  return avatarsList[randomIndex];
};

const adminService = {
  getAllUsers: async () => {
    try {
      const users = await User.find({});
      const usersWithNames = users.map((user) => {
        return {
          ...user._doc,
          name: user.name,
        };
      });
      return usersWithNames;
    } catch (error) {
      throw new Error("Server Error");
    }
  },

  updateUser: async (id, userData) => {
    try {
      const { firstName, lastName, mail, password, role, gender } = userData;

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      let user = await User.findById(id);
      let avatar = user.avatar;

      if (gender !== user.gender) {
        avatar = randomAvatar(gender);
      }

      user = await User.findByIdAndUpdate(
        id,
        {
          user_First_Name: firstName,
          user_Last_Name: lastName,
          user_Mail: mail,
          user_Password: hashedPassword,
          role,
          gender,
          avatar,
        },
        { new: true }
      );

      if (!user) {
        throw new Error("User not found");
      }

      return user;
    } catch (error) {
      throw error;
    }
  },

  deleteUser: async (id) => {
    try {
      const user = await User.findByIdAndDelete(id);
      if (!user) {
        throw new Error("User not found");
      }
    } catch (error) {
      throw new Error("Server Error");
    }
  },
};

module.exports = adminService;

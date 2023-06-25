const User = require("../models/user");
const bcrypt = require("bcryptjs");

module.exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});

    const usersWithNames = users.map((user) => {
      return {
        ...user._doc,
        name: user.name,
      };
    });

    res.status(200).json(usersWithNames);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports.updateUser = async (req, res) => {
  const avatars = {
    male: ["avatar_5", "avatar_12", "avatar_13", "avatar_14", "avatar_15", "avatar_18",],
    female: ["avatar_23", "avatar_8", "avatar_16", "avatar_20"],
  };

  const randomAvatar = (gender) => {
    const avatarsList = avatars[gender];
    const randomIndex = Math.floor(Math.random() * avatarsList.length);
    return avatarsList[randomIndex];
  };
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);


  try {
    const id = req.params.id;
    const gender = req.body.gender;
    let user = await User.findById(id);
    let avatar = user.avatar;

    if (gender !== user.gender) {
      avatar = randomAvatar(gender);
    }

    user = await User.findByIdAndUpdate(id, {
      user_First_Name: req.body.firstName,
      user_Last_Name: req.body.lastName,
      user_Mail: req.body.mail,
      user_Password: hashedPassword,
      role: req.body.role,
      gender,
      avatar
    }, { new: true });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    res.status(400).json({ message: "Error occurred", error: error.message });
  }
};


module.exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};


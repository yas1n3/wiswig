const User = require("../models/user");

module.exports.addUser = async (req, res, next) => {
  const { user_First_Name, user_Last_Name, user_Mail, user_Password, role } = req.body;
  
  try {
    // Verify if user is admin
    const creator = await User.findById(req.user._id);
    if (creator.role !== "admin") {
      return res.status(401).json({ message: "You don't have permission to create a new user." });
    }
    
    // Create new user
    const newUser = new User({
      user_First_Name,
      user_Last_Name,
      user_Mail,
      user_Password,
      role,
      creator: req.user._id,
    });
    
    await newUser.save();
    return res.status(201).json({ message: "User created successfully." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Something went wrong." });
  }
};



exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

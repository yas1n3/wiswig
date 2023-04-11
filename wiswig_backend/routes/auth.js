const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const randomstring = require("randomstring");
const mailer = require("../middleware/mailer");
const auth = require("../controllers/auth");
const admin = require("../controllers/admin");
router.post("/login", auth.loginUser);
router.post("/newPassowrd", auth.newPasword);
router.post("/updatePassowrd", auth.updatePassword);
router.post("/register", auth.register);
router.post("/adduser", admin.addUser);
// Verify the account
router.post("/verify", auth.verify);

// Get verified users
router.get("/verify", async (req, res) => {
  try {
    const users = await User.find({ active: true });
    res.json(users);
  } catch (err) {
    res.json({ message: "Oops!! Cannot get the users data!" });
  }
});

// Forgot password
//router.post("/forgot", auth.forgotPassword);

module.exports = router;

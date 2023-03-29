const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');


router.post('/adduser', adminController.addUser);
router.get("/users", adminController.getAllUsers);

module.exports = router;

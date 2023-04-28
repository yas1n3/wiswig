const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');


router.delete("/users/:id", adminController.deleteUser);
router.get("/users", adminController.getAllUsers);

module.exports = router;

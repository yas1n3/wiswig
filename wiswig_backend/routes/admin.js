const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');


router.delete("/delete/:id", adminController.deleteUser);
router.get("/users", adminController.getAllUsers);
router.put('/edit/:id', adminController.updateUser);


module.exports = router;

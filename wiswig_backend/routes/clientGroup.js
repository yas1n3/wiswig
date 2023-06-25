const express = require('express');
const router = express.Router();
const clientGroupController = require('../controllers/clientGroup');


router.post('/add', clientGroupController.addClientGroup);
router.get('/companies', clientGroupController.getClientGroups);
router.post('/addC', clientGroupController.addClientToGroup);

module.exports = router;

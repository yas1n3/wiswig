const express = require('express');
const router = express.Router();
const clientController = require('../controllers/client');

router.post('/add', clientController.addClient);
router.get('/clients', clientController.getAllClients);
router.put('/edit/:id', clientController.editClient);
router.delete('/delete/:id', clientController.deleteClient);

module.exports = router;

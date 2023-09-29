// controllers/clientController.js
const clientService = require("../services/client");

module.exports = {
    addClient: async (req, res) => {
        try {
            await clientService.addClient(req.body);
            res.status(201).json({ message: "Client created successfully." });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Something went wrong." });
        }
    },

    editClient: async (req, res) => {
        try {
            const clientId = req.params.id;
            await clientService.editClient(clientId, req.body);
            res.status(200).json({ message: "Client updated successfully." });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Something went wrong." });
        }
    },

    deleteClient: async (req, res) => {
        try {
            const clientId = req.params.id;
            await clientService.deleteClient(clientId);
            res.status(200).json({ message: "Client deleted successfully." });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Something went wrong." });
        }
    },

    getAllClients: async (req, res) => {
        try {
            const clientsWithNames = await clientService.getAllClients();
            res.status(200).json(clientsWithNames);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server Error" });
        }
    },
};

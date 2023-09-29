const Client = require("../models/client");
const ClientGroup = require("../models/clientGroup");

const clientService = {
    addClient: async (clientData) => {
        try {
            const { client_First_Name, client_Last_Name, client_Mail, clientGroupId } = clientData;

            const group = await ClientGroup.findById(clientGroupId);
            if (!group) {
                throw new Error("Client group not found.");
            }

            const newClient = new Client({
                client_First_Name,
                client_Last_Name,
                client_Mail,
                clientGroup: group._id,
            });

            await newClient.save();
        } catch (error) {
            throw error;
        }
    },

    editClient: async (clientId, clientData) => {
        try {
            const { client_First_Name, client_Last_Name, client_Mail, clientGroupId } = clientData;

            const group = await ClientGroup.findById(clientGroupId);
            if (!group) {
                throw new Error("Client group not found.");
            }

            const updatedClient = {
                client_First_Name,
                client_Last_Name,
                client_Mail,
                clientGroup: group._id,
            };

            const result = await Client.findByIdAndUpdate(clientId, updatedClient, { new: true });

            if (!result) {
                throw new Error("Client not found.");
            }
        } catch (error) {
            throw error;
        }
    },

    deleteClient: async (clientId) => {
        try {
            const result = await Client.findByIdAndDelete(clientId);

            if (!result) {
                throw new Error("Client not found.");
            }
        } catch (error) {
            throw error;
        }
    },

    getAllClients: async () => {
        try {
            const clients = await Client.find({}).populate("clientGroup");
            const clientsWithNames = clients.map((client) => {
                return {
                    ...client._doc,
                    name: client.name,
                };
            });
            return clientsWithNames;
        } catch (error) {
            throw error;
        }
    },
};

module.exports = clientService;

const ClientGroup = require("../models/clientGroup");
const Client = require("../models/client");

const clientGroupService = {
    addClientGroup: async (name) => {
        try {
            const newGroup = new ClientGroup({
                name,
            });

            await newGroup.save();
            console.log('Client group saved successfully:', name);

        } catch (error) {
            throw error;
        }
    },

    getClientGroups: async () => {
        try {
            const groups = await ClientGroup.find({}).populate('clients.clientId');
            return groups;
        } catch (error) {
            throw error;
        }
    },

    addClientToGroup: async (groupId, clientId) => {
        try {
            const group = await ClientGroup.findById(groupId);
            if (!group) {
                throw new Error("Client group not found.");
            }

            const client = await Client.findById(clientId);
            if (!client) {
                throw new Error("Client not found.");
            }

            group.clients.push({
                clientId: client._id,
                client: client.name,
            });

            await group.save();
        } catch (error) {
            throw error;
        }
    },
};

module.exports = clientGroupService;

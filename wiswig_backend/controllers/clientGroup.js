const clientGroupService = require("../services/clientGroup");

module.exports = {
    addClientGroup: async (req, res) => {
        try {
            const { name } = req.body;
            console.log('Received name:', name); // Log the received name
            await clientGroupService.addClientGroup(name);
            console.log('Client group created successfully:', name);
            res.status(201).json({ message: "Client group created successfully." });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Something went wrong." });
        }
    },

    getClientGroups: async (req, res) => {
        try {
            const groups = await clientGroupService.getClientGroups();
            res.status(200).json(groups);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server Error" });
        }
    },

    addClientToGroup: async (req, res) => {
        try {
            const { groupId, clientId } = req.body;
            await clientGroupService.addClientToGroup(groupId, clientId);
            res.status(200).json({ message: "Client added to group successfully." });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server Error" });
        }
    },
};
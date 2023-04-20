const ClientGroup = require("../models/clientGroup");

module.exports.addClientGroup = async (req, res, next) => {
    const { name } = req.body;

    try {
        const newGroup = new ClientGroup({
            name,
        });

        await newGroup.save();
        return res.status(201).json({ message: "Client group created successfully." });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Something went wrong." });
    }
};

module.exports.getClientGroups = async (req, res) => {
    try {
        const groups = await ClientGroup.find({}).populate("clients", "client_First_Name client_Last_Name client_Mail");

        res.status(200).json(groups);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

module.exports.addClientToGroup = async (req, res) => {
    const { groupId, clientId } = req.params;

    try {
        const group = await ClientGroup.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: "Client group not found." });
        }

        const client = await Client.findById(clientId);
        if (!client) {
            return res.status(404).json({ message: "Client not found." });
        }

        group.clients.push(client._id);
        await group.save();

        return res.status(200).json({ message: "Client added to group successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

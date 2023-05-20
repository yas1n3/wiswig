const Client = require("../models/client");
const ClientGroup = require("../models/clientGroup");

module.exports.addClient = async (req, res, next) => {
    const { client_First_Name, client_Last_Name, client_Mail, clientGroupId } = req.body;

    try {
        const group = await ClientGroup.findById(clientGroupId);
        if (!group) {
            return res.status(404).json({ message: "Client group not found." });
        }

        const newClient = new Client({
            client_First_Name,
            client_Last_Name,
            client_Mail,
            clientGroup: group._id,
        });

        await newClient.save();
        return res.status(201).json({ message: "Client created successfully." });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Something went wrong." });
    }
};

module.exports.editClient = async (req, res, next) => {
    const { client_First_Name, client_Last_Name, client_Mail, clientGroupId } = req.body;
    const clientId = req.params.id;

    try {
        const group = await ClientGroup.findById(clientGroupId);
        if (!group) {
            return res.status(404).json({ message: "Client group not found." });
        }

        const updatedClient = {
            client_First_Name,
            client_Last_Name,
            client_Mail,
            clientGroup: group._id,
        };

        const result = await Client.findByIdAndUpdate(clientId, updatedClient, { new: true });

        if (!result) {
            return res.status(404).json({ message: "Client not found." });
        }

        return res.status(200).json({ message: "Client updated successfully." });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Something went wrong." });
    }
};

module.exports.deleteClient = async (req, res, next) => {
    const clientId = req.params.id;

    try {
        const result = await Client.findByIdAndDelete(clientId);

        if (!result) {
            return res.status(404).json({ message: "Client not found." });
        }

        return res.status(200).json({ message: "Client deleted successfully." });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Something went wrong." });
    }
};

module.exports.getAllClients = async (req, res) => {
    try {
        const clients = await Client.find({}).populate("clientGroup");

        // Map over the clients array and add the virtual 'name' property
        const clientsWithNames = clients.map((client) => {
            return {
                ...client._doc,
                name: client.name,
            };
        });

        res.status(200).json(clientsWithNames);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};


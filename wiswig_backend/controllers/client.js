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


exports.getAllClients = async (req, res) => {
    try {
        const clients = await Client.find({});
        res.status(200).json(clients);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

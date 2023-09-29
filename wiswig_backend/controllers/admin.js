const adminService = require("../services/admin");

module.exports.getAllUsers = async (req, res) => {
  try {
    const usersWithNames = await adminService.getAllUsers();
    res.status(200).json(usersWithNames);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports.updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await adminService.updateUser(id, req.body);
    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    res.status(400).json({ message: "Error occurred", error: error.message });
  }
};

module.exports.deleteUser = async (req, res) => {
  try {
    await adminService.deleteUser(req.params.id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

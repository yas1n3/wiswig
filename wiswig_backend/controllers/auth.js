const authService = require("../services/auth");

module.exports = {
  register: async (req, res) => {
    try {
      await authService.register(req.body);
      res.status(200).send("User registered successfully!");
    } catch (error) {
      res.status(400).send("Server Error: " + error.message);
    }
  },

  loginUser: async (req, res) => {
    try {
      const { mail, password } = req.body;
      const token = await authService.loginUser(mail, password);

      // Set the token in the response, cookie, etc.

      return res.status(200).json({ message: "login successful", token });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ message: error.message });
    }
  },

  newPasword: async (req, res) => {
    try {
      await authService.newPasword(req.body.secretcode, req.body.password);
      res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
      res.status(400).json({ message: "Error occurred", error });
    }
  },

  updatePassword: async (req, res) => {
    try {
      await authService.updatePassword(req.body.id, req.body.password);
      res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
      res.status(400).json({ message: "Error occurred", error });
    }
  },

  verify: async (req, res) => {
    try {
      const { secretToken } = req.body;
      const user = await authService.verify(secretToken);
      res.status(200).send(user);
    } catch (error) {
      res.status(400).send("Error occurred");
    }
  },

  requireAuth: authService.requireAuth,

  logout: async (req, res) => {
    try {
      await authService.logout();
      res.clearCookie("jwt");
      res.status(200).send("Logged out successfully.");
    } catch (error) {
      res.status(400).send("Error occurred");
    }
  },
};

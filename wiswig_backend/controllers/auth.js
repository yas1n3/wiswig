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
      const { user, token } = await authService.loginUser(mail, password);

      if (!token) {
        return res.status(400).json({ message: "Authentication failed" });
      }

      // Set the token as a cookie
      res.cookie("token", token, {
        httpOnly: true,
        maxAge: 86400000, // 24 hours
        secure: true, // Set to true if using HTTPS
        sameSite: "none", // Set this flag for CSRF prevention if using same origin
      });
      return res.status(200).json({ message: "login successful", user, token });
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

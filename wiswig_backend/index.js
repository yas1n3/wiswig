const express = require("express");
const app = express();
const cors = require('cors');
const adminRoutes = require("./routes/admin");
const authRoutes = require("./routes/auth");
const nwsRoutes = require("./routes/newsletter");
const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/wiswig");
app.use(cors());
app.use(express.json());

app.use("/admin", adminRoutes);
app.use("/auth", authRoutes);
app.use("/newsletter", nwsRoutes);
const PORT = 4000;
const server = app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

module.exports = app;

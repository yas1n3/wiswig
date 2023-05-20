const express = require("express");
const app = express();
const cors = require("cors");
const adminRoutes = require("./routes/admin");
const authRoutes = require("./routes/auth");
const nwsRoutes = require("./routes/newsletter");
const clientRoutes = require('./routes/client');
const cGroupRoutes = require('./routes/clientGroup');
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const session = require("express-session");
require('dotenv').config();

mongoose.connect("mongodb://127.0.0.1:27017/wiswig");

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(session({
  secret: 'key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Put true if https
}));

app.use("/admin", adminRoutes);
app.use("/auth", authRoutes);
app.use("/newsletter", nwsRoutes);
app.use("/client", clientRoutes);
app.use('/company', cGroupRoutes);

const PORT = 4000;
const server = app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

module.exports = app;

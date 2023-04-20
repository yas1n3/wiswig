const mongoose = require("mongoose");

const clientSchema = mongoose.Schema(
  {
    client_First_Name: String,
    client_Last_Name: String,
    client_Mail: String,
    clientGroup: { type: mongoose.Schema.Types.ObjectId, ref: 'clientGroup' }
  },
  { timestamps: true }
);

module.exports = mongoose.model("client", clientSchema);

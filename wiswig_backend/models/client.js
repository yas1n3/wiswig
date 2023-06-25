const mongoose = require("mongoose");

const clientSchema = mongoose.Schema(
  {
    client_First_Name: String,
    client_Last_Name: String,
    client_Mail: String,
    clientGroup: { type: mongoose.Schema.Types.ObjectId, ref: 'clientGroup' },
    lastOpenedNewsletter: { type: mongoose.Schema.Types.ObjectId, ref: "Newsletter" },
  },
  { timestamps: true }
);

// Define a getter function for the 'name' field
clientSchema.virtual('name').get(function () {
  return `${this.client_First_Name} ${this.client_Last_Name}`;
});

module.exports = mongoose.model("client", clientSchema);

const mongoose = require('mongoose');

const clientGroupSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    clients: [
      {
        clientId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "client",
        },
        client: { type: String },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('clientGroup', clientGroupSchema);

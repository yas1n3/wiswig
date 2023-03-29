const mongoose = require('mongoose');

const clientGroupSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    clients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'client' }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('clientGroup', clientGroupSchema);

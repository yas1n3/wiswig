const mongoose = require("mongoose");

const newsletterSchema = mongoose.Schema(
  {
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: String,
    description: String,
    content: String,
    status: String,
  },
  { timestamps: true }
);
module.exports = mongoose.model("newsletter", newsletterSchema);

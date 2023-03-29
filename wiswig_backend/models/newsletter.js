const mongoose = require("mongoose");

const newsletterSchema = mongoose.Schema(
  {
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    title: String,
    description: String,
    HTMLcontent: String,
    JSONcontent: String,
    status: String,
  },
  { timestamps: true }
);
module.exports = mongoose.model("newsletter", newsletterSchema);

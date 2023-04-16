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
    HTMLcontent: String,
    JSONcontent: String,
    status: String,
    cover: String,
  },
  { timestamps: true }
);
module.exports = mongoose.model("newsletter", newsletterSchema);

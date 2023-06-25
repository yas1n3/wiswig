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
    recipients: [{ type: mongoose.Schema.Types.ObjectId, ref: "client" }],
    sentAt: { type: Date, default: Date.now },
    clicks: { type: Number, default: 0 },
    opens: { type: Number, default: 0 },
  },
  { timestamps: true }
);
module.exports = mongoose.model("newsletter", newsletterSchema);

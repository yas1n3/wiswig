const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    user_First_Name: String,
    user_Last_Name: String,
    user_Mail: String,
    user_Password: String,
    active: { type: Boolean, default: false },
    token: String,
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false,
      },
    role: {
      type: String,
      enum: ["admin", "notadmin"],
    },

    newsletters: [
      {
        nsId: { type: mongoose.Schema.Types.ObjectId, ref: "Newsletter" },
        ns: { type: String },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", userSchema);

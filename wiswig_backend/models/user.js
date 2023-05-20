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
      enum: ["Admin", "User"],
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    avatar: String,
    newsletters: [
      {
        newsletterId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Newsletter",
        },
        newsletter: { type: String },
      },
    ],
  },
  { timestamps: true }
);

// Define a virtual field 'name' using a getter function
userSchema.virtual('name').get(function () {
  return `${this.user_First_Name} ${this.user_Last_Name}`;
});

module.exports = mongoose.model("User", userSchema);

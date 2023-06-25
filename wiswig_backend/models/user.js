const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    user_First_Name: String,
    user_Last_Name: String,
    user_Mail: String,
    user_Password: String,
    active: { type: Boolean, default: false },
    // active: String,
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

userSchema.virtual('name').get(function () {
  return `${this.user_First_Name} ${this.user_Last_Name}`;
});

// Update the active status when a user connects or disconnects
userSchema.statics.setOnlineStatus = async function (userId, isOnline) {
  try {
    const user = await this.findByIdAndUpdate(
      userId,
      { active: isOnline },
      { new: true }
    );
    return user;
  } catch (error) {
    throw new Error("Failed to update user's online status");
  }
};

module.exports = mongoose.model("User", userSchema);

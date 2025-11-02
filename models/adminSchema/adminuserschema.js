import mongoose from "mongoose";
const childUserSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  role: {
    type: String,
    default: "child",
  },
  profilePicture: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },

  email_verified: {
    type: Boolean,
    default: false,
  },
  profilePicture: {
    type: String,
  },
  otp: String,
  otpExpiresAt: Date,

  childUsers: {
    type: [childUserSchema],
    validate: {
      validator: function (val) {
        return val.length <= 3;
      },
      message: "You can only add up to 3 child profiles.",
    },
    default: [
      {
        name: "Souvick Chakraborty",
        email: "souvickss.721@gmail.com",
      },
    ],
  },

  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("AdminUser", userSchema);

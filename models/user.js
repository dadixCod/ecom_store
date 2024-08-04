const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRound = process.env.BCRYPT_SALT || 10;

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    requierd: [true, "Email is required !"],
  },
  username: {
    type: String,
    requierd: [true, "Username is required"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationToken: String,
  verificationExpires: Date,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const hash = await bcrypt.hash(this.password, Number(saltRound));
  this.password = hash;
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;

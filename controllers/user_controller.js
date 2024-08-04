const User = require("../models/user");
const bcrypt = require("bcrypt");
const handleAsync = require("../utils/async_handler");
const jwtGenerator = require("../utils/jwt_generator");
const crypto = require("crypto");
const { sendResetEmail, sendVerificationMail } = require("../utils/mailer");

//Register
exports.register = handleAsync(async (req, res) => {
  //Distructure The body
  const { email, username, password } = req.body;

  //Checking missing credentials
  if (email != null && username != null && password != null) {
    //Checking already exists email
    const usedEmail = await User.findOne({ email: email });
    if (usedEmail == null) {
      const usedUsername = await User.findOne({ username: username });
      if (usedUsername == null) {
        //Creating user

        const newUser = new User({
          email,
          username,
          password,
        });

        const token = crypto.randomBytes(32).toString("hex");
        newUser.verificationToken = token;
        newUser.verificationExpires = Date.now() + 3600000;
        await newUser.save();
        await sendVerificationMail(email, token);
        res.status(201).json({
          status: "success",
          message: "A verification mail was sent .Please Verify your email",
        });
      } else {
        res.status(403).json({
          status: "failed",
          message: "Username already exists, please try logging in.",
        });
      }
    } else {
      res.status(403).json({
        status: "failed",
        message: "Email already exists, please try logging in.",
      });
    }
  } else {
    res.status(403).json({
      status: "failed",
      message: "Missing Credentials.",
    });
  }
});

//Login
exports.login = handleAsync(async (req, res) => {
  //Distructure body
  const { emailOrUsername, password } = req.body;

  //Checking by email or username
  if (emailOrUsername != null && password != null) {
    const user = await User.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
    });
    if (user != null) {
      //Password checking
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!user.isVerified) {
        return res.status(403).json({
          status: "failed",
          message: "Please verify your email",
        });
      }
      if (isPasswordValid) {
        //Generate a token
        const token = jwtGenerator(user._id);
        //Send response to user
        res.json({
          status: "success",
          user,
          token,
        });
      } else {
        res.status(403).json({
          status: "failed",
          message: "Invalid Password",
        });
      }
    } else {
      res.status(404).json({
        status: "failed",
        message: "User does not exist",
      });
    }
  }
});

//Verify email

exports.verifyEmail = handleAsync(async (req, res) => {
  const { token } = req.params;

  const user = await User.findOne({
    verificationToken: token,
    verificationExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationExpires = undefined;

  await user.save();

  res.status(200).json({
    status: "success",
    message: "Email verified successfully",
  });
});

exports.sendResetPassword = handleAsync(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  //Create a token
  const token = crypto.randomBytes(32).toString("hex");
  //set token and expiry date
  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

  await user.save();
  await sendResetEmail(email, token);
  res.status(200).json({ message: "Reset email sent" });
});

exports.passwordResetToken = handleAsync(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }
  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  res.status(200).json({
    status: "success",
    message: "Password reset successful",
  });
});

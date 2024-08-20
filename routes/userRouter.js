const router = require("express").Router();
const {
  register,
  login,
  sendResetPassword,
  passwordResetToken,
  verifyEmail,
  sendOtp,
  checkAuth,
} = require("../controllers/userController");

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/reset-password").post(sendResetPassword);
router.route("/reset-password/:token").post(passwordResetToken);
router.route("/send-otp").post(sendOtp);
router.route("/verify-otp/:userId").post(verifyEmail);
router.route("/check-auth").post(checkAuth);

module.exports = router;

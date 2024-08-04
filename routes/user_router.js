const router = require("express").Router();
const {
  register,
  login,
  sendResetPassword,
  passwordResetToken,
  verifyEmail,
} = require("../controllers/user_controller");

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/reset-password").post(sendResetPassword);
router.route("/reset-password/:token").post(passwordResetToken);
router.route("/verify-email/:token").post(verifyEmail);

module.exports = router;

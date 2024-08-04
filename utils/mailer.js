const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "hotmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

exports.sendResetEmail = async (email, token) => {
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Reset Password",
    text: `You requested for a password reset. Click on the link to reset your password: 
    http://localhost:3000/reset-password/${token}`,
  };
  return transporter.sendMail(mailOptions);
};

exports.sendVerificationMail = async (email, token) => {
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Storily Email Verification",
    text: `Please verify your email by clicking on the link below : http://localhost:3000/verification/${token}`,
  };
  return transporter.sendMail(mailOptions);
};

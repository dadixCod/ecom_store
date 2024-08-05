const nodemailer = require("nodemailer");
const fs = require("fs");
const handlebars = require("handlebars");
const path = require("path");

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

exports.sendVerificationMail = async (email, payload) => {
  const source = fs.readFileSync(
    path.join(__dirname, "..", "/templates/verification_temp.handlebars"),
    "utf8"
  );
  const compiledTemplate = handlebars.compile(source);

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Storily Email Verification",
    html: compiledTemplate(payload),
  };
  return transporter.sendMail(mailOptions);
};

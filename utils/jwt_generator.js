const jwt = require("jsonwebtoken");
require("dotenv").config();

function jwtGenerator(userId) {
  const payload = {
    userId,
  };

  return jwt.sign(payload, process.env.SECRET_KEY, {
    expiresIn: 60 * 60 * 3600,
  });
}

module.exports = jwtGenerator;

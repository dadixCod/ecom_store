const jwt = require("jsonwebtoken");

const tokenChecker = async (req, res, next) => {
  try {
    const token = req.header("token");
    if (!token) {
      return res.status(401).send("Access denied. No token provided.");
    }
    jwt.verify(token, process.env.SECRET_KEY);
    next();
  } catch (error) {
    res.status(400).send("Invalid token.");
  }
};

module.exports = tokenChecker;

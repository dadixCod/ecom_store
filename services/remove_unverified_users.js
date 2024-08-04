const User = require("../models/user");

const removeUnverifiedUsers = async () => {
  try {
    const result = await User.deleteMany({ isVerified: false });
    console.log(`Removed ${result.deletedCount} unverified users.`);
  } catch (error) {
    console.error("Error removing unverified users:", error);
  }
};

module.exports = removeUnverifiedUsers;

const cron = require("node-cron");
const removeUnverifiedUsers = require("../services/remove_unverified_users");

cron.schedule("0 0 * * *", () => {
  removeUnverifiedUsers()
    .then(() => console.log("Scheduled task executed successfully."))
    .catch((error) => console.error("Error executing scheduled task:", error));
});

const app = require("./index");
const mongoose = require("mongoose");

const database_url = process.env.DATABASE_URL;
const port = process.env.PORT;
mongoose.connect(database_url);

const db = mongoose.connection;

db.on("error", (err) => console.log(err));

db.once("open", () => {
  console.log("Database connected succcessfully");
});

app.listen(port, () => {
  console.log("App Started successfully!");
});

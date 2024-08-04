const express = require("express");
require("dotenv").config();

const app = express();

// MiddleWares
app.use(express.json());

//Routes

const userRouter = require("./routes/user_router");

app.use("/auth", userRouter);

//Server

//Schedular
require("./utils/schedular");

module.exports = app;

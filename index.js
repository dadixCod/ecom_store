const express = require("express");
require("dotenv").config();
const tokenChecker = require("./middlewares/tokenChecker");

const app = express();

//static foder path
app.use("/images", express.static("public"));

// MiddleWares
app.use(express.json());

//Routes

const userRouter = require("./routes/userRouter");
const brandRouter = require("./routes/brandRouter");
const categoryRouter = require("./routes/categoryRouter");
const subCategoryRouter = require("./routes/subCategoryRouter");
const productRouter = require("./routes/productRouter");

app.use("/auth", userRouter);
app.use("/brand", tokenChecker, brandRouter);
app.use("/category", tokenChecker, categoryRouter);
app.use("/subcategory", tokenChecker, subCategoryRouter);
app.use("/product", tokenChecker, productRouter);

//Server

//Schedular
require("./utils/schedular");

module.exports = app;

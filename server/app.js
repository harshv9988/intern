const express = require("express");
const app = express();
const cors = require("cors");
// const fileupload = require("express-fileupload");
const path = require("path");

const cookieParser = require("cookie-parser");
const bodyparser = require("body-parser");

//parsing middlewares
app.use(express.json());
app.use(bodyparser.urlencoded({ extended: true }));
// app.use(fileupload());
app.use(cookieParser());

//cors
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

app.use("/", require("./routes/index"));

module.exports = app;

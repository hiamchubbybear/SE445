const express = require("express");
require("dotenv").config();
const router = require("./routes/web.js");
const app = express();
const ejs = require("ejs");
const port = process.env.PORT;
const path = require("path");
const configViewEngine = require("./config/configViewEngine.js");

configViewEngine(app);
console.log(app.path);
app.use("/v1", router);
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

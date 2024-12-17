const express = require("express");
require("dotenv").config();
const router = require("./routes/web.js");
const app = express();
const ejs = require("ejs");
const port = process.env.PORT;
const CONNECTION_STRING = process.env.MONGODB_URI;
const path = require("path");
const configViewEngine = require("./config/configViewEngine.js");
app.use(express.json());
configViewEngine(app);
app.use("v1", router);
console.log(CONNECTION_STRING);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

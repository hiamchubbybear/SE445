const express = require("express");
require("dotenv").config();
const cors = require("cors");
const router = require("./routes/web.js");
const app = express();
const ejs = require("ejs");
const port = process.env.PORT;
const CONNECTION_STRING = process.env.MONGODB_URI;
const path = require("path");
const configViewEngine = require("./config/configViewEngine.js");
const { ensureConnected } = require("./controllers/profileController.js");

app.use(express.json());
configViewEngine(app);
app.use(cors());
app.use(express.json());
app.use("/v1", router);
console.log(CONNECTION_STRING);
ensureConnected
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

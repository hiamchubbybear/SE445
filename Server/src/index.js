const express = require("express");
const app = express();
const ejs = require("ejs");
const port = 3000;
const path = require("path");

// config template engine
app.set("views", path.join(__dirname), "view/");
app.set("view engine", "ejs");
app.get("/", (req, res) => {
  res.send("<h1>Can you hello worlds ??<h1>");
});
app.get("/homepage", (req, res) => {
  res.render("server.ejs");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

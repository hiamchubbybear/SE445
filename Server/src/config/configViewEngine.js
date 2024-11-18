const { dir } = require("console");
const { prototype } = require("events");
const express = require("express");
const path = require("path");
const configViewEngine = (app) => {
  console.log(__dirname);
  app.set("views", path.join("../src", "views"));
  app.set("view engine", "ejs");
  app.use(express.static(path.join("../src", "public")));
};
module.exports = configViewEngine;

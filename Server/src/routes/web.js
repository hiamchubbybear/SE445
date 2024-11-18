const express = require("express");
const {
  homepageRequest,
  handleHelloWorldsRequest,
} = require("../controllers/homeController.js");

const route = express.Router();
route.get("/", homepageRequest);
route.get("/helloworlds", handleHelloWorldsRequest);
route.get("/homepage", homepageRequest);
module.exports = route;

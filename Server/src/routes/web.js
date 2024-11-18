const express = require("express");
const {
  createAccountRequest,
  handleHelloWorldsRequest,
} = require("../controllers/homeController.js");

const route = express.Router();
route.post("/create", createAccountRequest);
route.get("/helloworlds", handleHelloWorldsRequest);
route.get("/login", createAccountRequest);
module.exports = route;

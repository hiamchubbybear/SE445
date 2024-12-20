const express = require("express");
const {
  createAccountRequest,
  handleHelloWorldsRequest,
  Login,
} = require("../controllers/accountController.js");

const route = express.Router();
route.post("/create", createAccountRequest);
route.get("/helloworld", handleHelloWorldsRequest);
route.post("/login", Login);
module.exports = route;

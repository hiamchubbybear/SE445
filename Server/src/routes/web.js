const express = require("express");
const {
  createAccountRequest,
  handleHelloWorldsRequest,
  Login,
  forgotPasswordRequest,
} = require("../controllers/accountController.js");

const {
  getCourses,
  createCourse,
  updateCourse,
} = require("../controllers/coursesController.js");

const { verifyToken } = require("../middleware/auth.js");

const route = express.Router();

route.post("/create", createAccountRequest);
route.get("/helloworld", handleHelloWorldsRequest);
route.post("/login", Login);
route.post("/forgot-password", forgotPasswordRequest);

route.get("/admin/courses", verifyToken, getCourses);
route.post("/admin/courses", verifyToken, createCourse);
route.put("/admin/courses/:id", verifyToken, updateCourse);

module.exports = route;

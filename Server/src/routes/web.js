const express = require("express");
const {
  createAccountRequest,
  handleHelloWorldsRequest,
  Login,
  forgotPasswordRequest,
} = require("../controllers/accountController.js");

const { purchaseCourses } = require("../controllers/purchaseController");

const {
  getCourses,
  createCourse,
  updateCourse,
} = require("../controllers/coursesController.js");

const {
  getCart,
  addToCart,
  removeFromCart,
  clearCart,
} = require("../controllers/cartController");

const { verifyToken, requireRole } = require("../middleware/auth.js");

const route = express.Router();

// Public Routes
route.post("/create", createAccountRequest);
route.get("/helloworld", handleHelloWorldsRequest);
route.post("/login", Login);
route.post("/forgot-password", forgotPasswordRequest);

// Admin Course Management
route.get("/admin/courses", verifyToken, requireRole("ADMIN"), getCourses);
route.post("/admin/courses", verifyToken, requireRole("ADMIN"), createCourse);
route.put(
  "/admin/courses/:id",
  verifyToken,
  requireRole("ADMIN"),
  updateCourse
);

// Cart (User Authenticated Required)
route.get("/cart", verifyToken, getCart);
route.post("/cart/add", verifyToken, addToCart);
route.post("/cart/remove", verifyToken, removeFromCart);
route.post("/cart/clear", verifyToken, clearCart);

// Course Purchase
route.post("/purchase", verifyToken, purchaseCourses);

module.exports = route;

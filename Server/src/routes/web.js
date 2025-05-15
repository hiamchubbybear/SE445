const express = require("express");
const {
  createAccountRequest,
  Login,
  forgotPasswordRequest,
  resetPassword,
  inactivateAccount,
  activateAccount,
} = require("../controllers/accountController.js");
const { purchaseCourses } = require("../controllers/purchaseController");
const {
  getCourses,
  createCourse,
  updateCourse,
  userGetCourses,
} = require("../controllers/coursesController.js");
const {
  getCart,
  addToCart,
  removeFromCart,
  clearCart,
} = require("../controllers/cartController");
const {
  getProfile,
  updateProfile,
  getAllProfiles,
} = require("../controllers/profileController.js");
const { verifyToken, requireRole } = require("../middleware/auth.js");
const {
  createPost,
  updatePost,
  deletePost,
  addComment,
  deleteComment,
  getPostWithComments,
  getAllPosts,
} = require("../controllers/socialController.js");
const route = express.Router();

// Public Routes
route.post("/create", createAccountRequest);
route.post("/login", Login);
route.post("/forgot-password", forgotPasswordRequest);
route.post("/reset-password", resetPassword);
// Admin Course Management
route.get("/admin/courses", verifyToken, requireRole("ADMIN"), getCourses);
route.post("/admin/courses", verifyToken, requireRole("ADMIN"), createCourse);
route.put(
  "/admin/courses/:id",
  verifyToken,
  requireRole("ADMIN"),
  updateCourse
);
route.get("/admin/profiles", verifyToken, requireRole("ADMIN"), getAllProfiles);
// Admin Account Management
route.post(
  "/admin/inactivate",
  verifyToken,
  requireRole("ADMIN"),
  inactivateAccount
);
route.post(
  "/admin/activate",
  verifyToken,
  requireRole("ADMIN"),
  activateAccount
);

// Cart (User Authenticated Required)
route.get("/cart", verifyToken, getCart);
route.post("/cart/add", verifyToken, addToCart);
route.post("/cart/remove", verifyToken, removeFromCart);
route.post("/cart/clear", verifyToken, clearCart);

// Course Purchase
route.post("/purchase", verifyToken, purchaseCourses);
// Profile
route.get("/", verifyToken, getProfile);
route.put("/", verifyToken, updateProfile);
// Courses
route.get("/courses", verifyToken, userGetCourses);

// Post
route.post("/posts", verifyToken, createPost);
route.put("/posts/:id", verifyToken, updatePost);
route.delete("/posts/:id", verifyToken, deletePost);
route.get("/posts/:id", getPostWithComments);
route.get("/posts", getAllPosts);

// Comment
route.post("/comments", verifyToken, addComment);
route.delete("/comments/:id", verifyToken, deleteComment);

module.exports = route;

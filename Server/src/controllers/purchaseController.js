const mongoose = require("mongoose");
const Cart = require("../collection/cart");
const User = require("../collection/users");
const Course = require("../collection/courses");
const CONNECTION_STRING = process.env.MONGODB_URI;
const PurchaseHistory = require("../collection/purchase.js");

const purchaseCourses = async (req, res) => {
  try {
    await mongoose.connect(CONNECTION_STRING);

    const userId = new mongoose.Types.ObjectId(req.user.id);
    const cart = await Cart.findOne({ userId });
    if (!cart || cart.courses.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const user = await User.findById(userId).exec();
    if (!user) return res.status(404).json({ message: "User not found" });

    user.purchasedCourses = user.purchasedCourses || [];
    const purchasedIds = user.purchasedCourses.map((id) => id.toString());
    const newCourses = cart.courses.filter(
      (cId) => !purchasedIds.includes(cId.toString())
    );
    if (newCourses.length === 0) {
      return res.status(400).json({ message: "No new courses to purchase" });
    }

    const coursesInfo = await Course.find({ _id: { $in: newCourses } });
    const totalPrice = coursesInfo.reduce(
      (sum, course) => sum + (course.price || 0),
      0
    );

    const history = new PurchaseHistory({
      userId,
      courses: newCourses,
      totalPrice,
    });
    await history.save();

    user.purchasedCourses = user.purchasedCourses.concat(newCourses);
    await user.save();

    cart.courses = [];
    await cart.save();

    res.status(200).json({
      message: "Purchase successful",
      purchased: newCourses,
      totalPrice,
      historyId: history._id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPurchaseHistory = async (req, res) => {
  try {
    await mongoose.connect(CONNECTION_STRING);
    const userId = req.user.id;

    const rawHistory = await PurchaseHistory.find({ userId })
      .populate("courses", "title price image")
      .sort({ createdAt: -1 })
      .lean();
    const history = rawHistory.map((item) => ({
      ...item,
      historyId: item._id,
    }));

    res.status(200).json({ history });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllPurchaseHistory = async (req, res) => {
  try {
    await mongoose.connect(CONNECTION_STRING);

    const rawHistories = await PurchaseHistory.find()
      .populate("userId", "username email")
      .populate("courses", "title price image")
      .sort({ createdAt: -1 })
      .lean();
    const histories = rawHistories.map((item) => ({
      ...item,
      historyId: item._id,
    }));

    res.status(200).json({ histories });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getOnePurchaseHistory = async (req, res) => {
  const { historyId } = req.params;

  try {
    await mongoose.connect(CONNECTION_STRING);

    const history = await PurchaseHistory.findById(historyId)
      .populate("userId", "username email _id")
      .populate("courses", "title price image");
    if (!history) {
      return res.status(404).json({ message: "Purchase history not found" });
    }
    const isOwner = history.userId._id.toString() === req.user.id;
    const isAdmin = req.user.role === "ADMIN";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Forbidden: Access denied" });
    }

    res.status(200).json({ history });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  purchaseCourses,
  getPurchaseHistory,
  getAllPurchaseHistory,
  getOnePurchaseHistory,
};

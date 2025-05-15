const mongoose = require("mongoose");
const Cart = require("../collection/cart");
const Course = require("../collection/courses");

const CONNECTION_STRING =
  process.env.MONGODB_URI || "mongodb://localhost:27017/se445";

const getCart = async (req, res) => {
  const userId = req.user.id;
  try {
    await mongoose.connect(CONNECTION_STRING);
    const cart = await Cart.findOne({ userId }).populate("courses");
    res.status(200).json({ cart });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const addToCart = async (req, res) => {
  const userId = req.user.id;
  const { courseId } = req.body;
  try {
    await mongoose.connect(CONNECTION_STRING);
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, courses: [courseId] });
    } else {
      if (cart.courses.includes(courseId)) {
        return res.status(400).json({ message: "Course already in cart" });
      }
      cart.courses.push(courseId);
    }

    await cart.save();
    res.status(201).json({ message: "Course added to cart", cart });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const removeFromCart = async (req, res) => {
  const userId = req.user.id;
  const { courseId } = req.body;
  try {
    await mongoose.connect(CONNECTION_STRING);
    const cart = await Cart.findOne({ userId });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.courses = cart.courses.filter(
      (cId) => cId.toString() !== courseId.toString()
    );

    await cart.save();
    res.status(200).json({ message: "Course removed", cart });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const clearCart = async (req, res) => {
  const userId = req.user.id;
  try {
    await mongoose.connect(CONNECTION_STRING);
    const cart = await Cart.findOneAndUpdate(
      { userId },
      { courses: [] },
      { new: true }
    );
    res.status(200).json({ message: "Cart cleared", cart });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getCart,
  addToCart,
  removeFromCart,
  clearCart,
};

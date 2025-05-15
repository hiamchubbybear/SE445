const mongoose = require("mongoose");
const Cart = require("../collection/cart");
const User = require("../collection/users");

const CONNECTION_STRING = process.env.MONGODB_URI;

const purchaseCourses = async (req, res) => {
  const userId = req.user.id;

  try {
    await mongoose.connect(CONNECTION_STRING);
    const cart = await Cart.findOne({ userId });
    if (!cart || cart.courses.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const user = await User.findOne({ _id: userId });
    if (!user) return res.status(404).json({ message: "User not found" });

    const newCourses = cart.courses.filter(
      (cId) => !user.purchasedCourses.includes(cId)
    );
    user.purchasedCourses.push(...newCourses);
    await user.save();

    cart.courses = [];
    await cart.save();

    res
      .status(200)
      .json({ message: "Purchase successful", purchased: newCourses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { purchaseCourses };

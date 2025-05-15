const mongoose = require("mongoose");
const Cart = require("../collection/cart");
const User = require("../collection/users");
const CONNECTION_STRING = process.env.MONGODB_URI;
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

    console.log("User loaded:", user);
    console.log("Type of purchasedCourses:", typeof user.purchasedCourses);
    console.log("Is Array?", Array.isArray(user.purchasedCourses));

    user.purchasedCourses = user.purchasedCourses || [];
    const purchasedIds = user.purchasedCourses.map((id) => id.toString());
    const newCourses = cart.courses.filter(
      (cId) => !purchasedIds.includes(cId.toString())
    );
    if (newCourses.length === 0) {
      return res.status(400).json({ message: "No new courses to purchase" });
    }
    user.purchasedCourses = user.purchasedCourses.concat(newCourses);
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

const mongoose = require("mongoose");

const PurchaseHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    courses: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    ],
    totalPrice: { type: Number, required: true },
  },
  { timestamps: true }
);

const PurchaseHistory = mongoose.model(
  "PurchaseHistory",
  PurchaseHistorySchema
);
module.exports = PurchaseHistory;

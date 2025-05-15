const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String,
  purchasedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "courses" }],
});

module.exports = mongoose.models.users || mongoose.model("users", UserSchema);

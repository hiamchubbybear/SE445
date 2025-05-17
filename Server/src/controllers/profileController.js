const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../collection/users.js");
const CONNECTION_STRING =
  process.env.MONGO_URI || "mongodb://localhost:27017/se445";

async function ensureConnected() {
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(CONNECTION_STRING);
  }
}

const getProfile = async (req, res) => {
  try {
    await ensureConnected();

    const user = await User.findById(req.user.id).select(
      "-password -activatecode -__v"
    );
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (err) {
    console.error("Get profile error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    await ensureConnected();

    const { username, email, password, avatar } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (username) user.username = username;
    if (email) user.email = email;
    if (avatar) user.avatar = avatar;
    if (password) user.password = await bcrypt.hash(password, 10);

    await user.save();

    res.status(200).json({ message: "Profile updated successfully" });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ message: "Update failed", error: err.message });
  }
};

const getAllProfiles = async (req, res) => {
  try {
    await ensureConnected();

    const users = await User.find({}, "-password -activatecode -docs -quizz");
    res.status(200).json({ total: users.length, users });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getAllProfiles,
  ensureConnected,
};

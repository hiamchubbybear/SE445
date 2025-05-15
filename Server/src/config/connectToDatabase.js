const mongoose = require("mongoose");

let isConnected = false;
CONNECTION_STRING = process.env.MONGODB_URI
async function connectToDatabase() {
  if (isConnected) return;
  try {
    await mongoose.connect(CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true;
    console.log("Connected to the database");
  } catch (err) {
    console.error("Database connection error:", err);
    throw err;
  }
}

module.exports = connectToDatabase;

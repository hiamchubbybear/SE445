const mongoose = require("mongoose");

let isConnected = false;
const CONNECTION_STRING = "mongodb://localhost:27017/se445"
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

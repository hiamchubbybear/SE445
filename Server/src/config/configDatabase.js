const mongoose = require("mongoose");
const CONNECTION_STRING =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/se445";
const databaseConfiguration = async (mongoose) => {
  try {
    console.log(CONNECTION_STRING);

    await mongoose.connect(CONNECTION_STRING, {});
    console.log("Connected to the database!");
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
};

module.exports = {
  databaseConfiguration,
};

const mongoose = require("mongoose");

function connectToDatabase(CONNECTION_STRING) {
  mongoose
    .connect(CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("Connected to the database"))
    .catch((err) => console.error("Database connection error:", err));
}

const UserScheme = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: [6, "Username must be at least 6 characters"],
    maxlength: [20, "Username must be less than 20 characters"],
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (v) {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(v);
      },
      message: "Email is not a valid email address!",
    },
  },
  activatecode: {
    type: String,
  },
  status: {
    default: false,
    type: Boolean,
  },
});

module.exports = {
  connectToDatabase,
  UserScheme,
};

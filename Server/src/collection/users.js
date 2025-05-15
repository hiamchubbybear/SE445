const mongoose = require("mongoose");
const validator = require("validator");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      minlength: [5, "Username must be at least 5 characters"],
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
        validator: validator.isEmail,
        message: "Email is not a valid email address!",
      },
    },
    activatecode: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["active", "inactive", "deleted"],
      default: "active",
    },
    purchasedCourses: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      default: []
    }],
  },
  { timestamps: true }
);

UserSchema.post("save", function (error, doc, next) {
  if (error.name === "MongoServerError" && error.code === 11000) {
    next(new Error("Duplicate field value entered"));
  } else {
    next();
  }
});

const UserModel = mongoose.models.User || mongoose.model("User", UserSchema);

module.exports = UserModel;

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { ErrorMessage } = require("../dto/errorHandleDTO");
const saltRounds = 10;
const myPlaintextPassword = process.env.PLANT_TEXT_PASSWORD;
const someOtherPlaintextPassword = process.env.OTHER_PLANT_TEXT_PASSWORD;
const CONNECTION_STRING = process.env.MONGODB_URI;
const handleHelloWorldsRequest = () => {
  res.send("Hello worlds");
};
const hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (err) {
    console.error("Error hashing password:", err);
    throw err;
  }
};
const createAccountRequest = async (req, res) => {
  try {
    mongoose.connect(CONNECTION_STRING);
    const UserSchema = new mongoose.Schema({
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
    });
    const { username, password, email } = req.body;
    if (!username || !password || !email) {
      return res.status(400).send("Missing required fields");
    }
    const UserAccountModel =
      mongoose.models.users || mongoose.model("users", UserSchema);
    const hashedPassword = await hashPassword(password);
    const newAccount = new UserAccountModel({
      username: username,
      password: hashedPassword,
      email: email,
    });
    const responeDTO = {
      message: "Request was successful",
      data: {
        username: username,
        password: hashedPassword,
        email: email,
      },
    };
    await newAccount.save();
    res.status(200).json(responeDTO);
  } catch (error) {
    console.error(error);
    const status = 500;
    const data = {
      data: null,
      message: "Error connecting to the database or handling request",
    };
    const errorMsg = new ErrorMessage(status, data);
    res.status(status).send(errorMsg);
  }
};

module.exports = {
  handleHelloWorldsRequest,
  createAccountRequest,
};

const fs = require("fs");
const jwt = require("jsonwebtoken");
const SIGNER_KEY = process.env.SIGNER_KEY;
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const encryptedPassword = require("../middleware/encryptingPassword.js");
const nodemailer = require("nodemailer");
const { getRandomAlphanumericString } = require("../config/randomAccount.js");
const { ErrorMessage } = require("../dto/errorHandleDTO.js");
const { hashPassword } = require("../middleware/hashPassword.js");
const { UserScheme, LoginSchema } = require("../dto/res/accountResponeDTO.js");
const {
  emailSendService,
  fotgotPasswordEmailSender,
} = require("../config/configMailSender.js");
const { AccountDTO } = require("../dto/res/accountDTO.js");
const CONNECTION_STRING = process.env.MONGODB_URI;
const handleHelloWorldsRequest = () => {
  res.send("Hello worlds");
};
const createAccountRequest = async (req, res) => {
  try {
    mongoose.connect(CONNECTION_STRING);
    await mongoose.connection.collection("users").dropIndexes();
    const UserSchema = UserScheme;
    const activatecode = getRandomAlphanumericString();
    const { username, password, email } = req.body;
    if (!username || !password || !email) {
      const status = 400;
      const data = {
        message: "Missing feild",
      };
      const errorMsg = new ErrorMessage(status, data);
      return res.status(400).send(errorMsg);
    }

    const UserAccountModel =
      mongoose.models.users || mongoose.model("users", UserSchema);
    const hashedPassword = await hashPassword(password);
    console.log(username, hashedPassword, email);
    const newAccount = new UserAccountModel({
      username: username,
      password: hashedPassword,
      email: email,
      activatecode: activatecode,
      status: false,
    });
    await newAccount.save();
    emailSendService(email, username, activatecode);
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    });
    const message = "Sent email and create account success";
    res
      .status(200)
      .json(new AccountDTO("200", message, username, password, email));
  } catch (error) {
    console.error(error);
    const status = 500;
    const data = {
      message: error.message,
    };
    const errorMsg = new ErrorMessage(status, data);
    res.status(status).send(errorMsg);
  }
};
const forgotPasswordRequest = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        code: 400,
        message: "Missing email",
      });
    }
    await mongoose.connect(CONNECTION_STRING);
    const UserAccountModel = mongoose.models.users || mongoose.model("users", UserScheme);
    const user = await UserAccountModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        code: 404,
        message: "Email not found",
      });
    }
    const resetCode = getRandomAlphanumericString();
    user.activatecode = resetCode;
    await user.save();
    await fotgotPasswordEmailSender(email, user.username, resetCode);
    return res.status(200).json({
      code: 200,
      message: "Reset code sent to your email",
    });
  } catch (error) {
    console.error("Error in forgotPasswordRequest:", error.message);
    return res.status(500).json({
      code: 500,
      message: error.message,
    });
  }
};


const Login = async (req, res) => {
  mongoose.connect(CONNECTION_STRING);
  const { username, password } = req.body;
  const LoginSchema = new mongoose.Schema({
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      minlength: [6, "Username must be at least 6 characters"],
      maxlength: [20, "Username must be less than 20 characters"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });
  const LoginModel =
    mongoose.models.users || mongoose.model("users", LoginSchema);
  const user = await LoginModel.findOne({ username: username }).select(
    "password"
  );
  console.log("password", user);
  if (bcrypt.compare(req.body.password, user.password)) {
    jwt.sign(
      { username: username, iat: Math.floor(Date.now() / 1000) - 30 },
      SIGNER_KEY,
      {
        algorithm: "HS256",
        expiresIn: "1h",
        issuer: "chessy",
    jwtid: "jwtid",
      },
      (err, decodeURI) => {
        if (err) console.log("There are some err " + err.message);
        else {
          res.status(201).send({
            code: 200,
            data: {
              message: "Your request successfully",
              jwtToken: decodeURI,
            },
          });
        }
      }
    );
  }
};

module.exports = {
  handleHelloWorldsRequest,
  createAccountRequest,
  Login,
  forgotPasswordRequest
};

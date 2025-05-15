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

const handleHelloWorldsRequest = (req, res) => {
  res.send("Hello worlds");
};

const createAccountRequest = async (req, res) => {
  try {
    await mongoose.connect(CONNECTION_STRING);
    const UserSchema = UserScheme;
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
      return res
        .status(400)
        .send(new ErrorMessage(400, { message: "Missing field" }));
    }

    if (username.length < 5 || password.length < 5) {
      return res.status(400).send(
        new ErrorMessage(400, {
          message: "Username and password must be at least 5 characters long",
        })
      );
    }

    const UserAccountModel =
      mongoose.models.users || mongoose.model("users", UserSchema);

    const existingUser = await UserAccountModel.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      return res.status(409).send(
        new ErrorMessage(409, {
          message: "Username or Email already exists",
        })
      );
    }

    const hashedPassword = await hashPassword(password);
    const activatecode = getRandomAlphanumericString();

    const newAccount = new UserAccountModel({
      username,
      password: hashedPassword,
      email,
      activatecode,
      status: false,
    });

    await newAccount.save();
    await emailSendService(email, username, activatecode);

    res
      .status(200)
      .json(
        new AccountDTO(
          "200",
          "Sent email and created account",
          username,
          password,
          email
        )
      );
  } catch (error) {
    console.error(error);
    res.status(500).send(new ErrorMessage(500, { message: error.message }));
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
    const UserAccountModel =
      mongoose.models.users || mongoose.model("users", UserScheme);

    const user = await UserAccountModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        code: 404,
        message: "Email not found",
      });
    }
    console.log("User:", user);
    console.log("Username:", user.username);

    const resetCode = getRandomAlphanumericString();
    user.activatecode = resetCode;
    await user.save();
    await fotgotPasswordEmailSender(email, user.username, resetCode);

    res.status(200).json({
      code: 200,
      message: "Reset code sent to your email",
    });
  } catch (error) {
    console.error("Error in forgotPasswordRequest:", error.message);
    res.status(500).json({
      code: 500,
      message: error.message,
    });
  }
};

const Login = async (req, res) => {
  try {
    await mongoose.connect(CONNECTION_STRING);
    const { username, password } = req.body;

    const LoginModel =
      mongoose.models.users || mongoose.model("users", LoginSchema);

    const user = await LoginModel.findOne({ username });

    if (!user) {
      return res.status(404).json({
        code: 404,
        message: "Account not found",
      });
    }

    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      return res.status(401).json({
        code: 401,
        message: "Invalid password",
      });
    }

    const payload = {
      id: user._id.toString(),
      username: user.username,
      role: "USER",
      scope: "user",
      iat: Math.floor(Date.now() / 1000),
    };

    if (username === "admin" && password === "admin") {
      payload.role = "ADMIN";
      payload.scope = "admin";
    }

    const token = jwt.sign(payload, SIGNER_KEY, {
      algorithm: "HS256",
      expiresIn: "1h",
      issuer: "chessy",
      jwtid: "jwtid",
    });
    res.status(201).send({
      code: 200,
      data: {
        message: "Login successful",
        jwtToken: token,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({
      code: 500,
      message: error.message,
    });
  }
};

module.exports = {
  handleHelloWorldsRequest,
  createAccountRequest,
  Login,
  forgotPasswordRequest,
};

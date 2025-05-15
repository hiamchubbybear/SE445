const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const connectToDatabase = require("../config/connectToDatabase.js");
const { getRandomAlphanumericString } = require("../config/randomAccount.js");
const { ErrorMessage } = require("../dto/errorHandleDTO.js");
const { hashPassword } = require("../middleware/hashPassword.js");
const { UserScheme } = require("../dto/res/accountResponeDTO.js");
const {
  emailSendService,
  fotgotPasswordEmailSender,
} = require("../config/configMailSender.js");
const { AccountDTO } = require("../dto/res/accountDTO.js");

const CONNECTION_STRING = process.env.MONGODB_URI;
const SIGNER_KEY = process.env.SIGNER_KEY;
const clientURL = process.env.CLIENT_URL;

const UserModel = mongoose.models.users || mongoose.model("users", UserScheme);

const createAccountRequest = async (req, res) => {
  try {
    await connectToDatabase(CONNECTION_STRING);

    const { username, password, email } = req.body;
    if (!username || !password || !email) {
      return res
        .status(400)
        .send(new ErrorMessage(400, { message: "Missing field" }));
    }

    const existingUser = await UserModel.findOne({
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

    const newAccount = new UserModel({
      username,
      password: hashedPassword,
      email,
      activatecode,
      status: "activate",
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
    console.error("createAccountRequest error:", error.message);
    res.status(500).send(new ErrorMessage(500, { message: error.message }));
  }
};

const forgotPasswordRequest = async (req, res) => {
  try {
    await connectToDatabase(CONNECTION_STRING);

    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ code: 400, message: "Missing email" });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ code: 404, message: "Email not found" });
    }

    const resetToken = jwt.sign(
      {
        email: user.email,
        purpose: "reset",
        iat: Math.floor(Date.now() / 1000),
      },
      SIGNER_KEY,
      {
        expiresIn: "24h",
        issuer: "chessy",
        jwtid: `reset-${user._id}`,
      }
    );

    const resetLink = `https://${clientURL}/reset-password?token=${resetToken}`;
    await fotgotPasswordEmailSender(user.email, user.username, resetLink);

    res.status(200).json({
      code: 200,
      message: "Reset link sent to your email",
    });
  } catch (error) {
    console.error("forgotPasswordRequest error:", error.message);
    res.status(500).json({ code: 500, message: error.message });
  }
};

const Login = async (req, res) => {
  try {
    await mongoose.connect(CONNECTION_STRING);
    const { username, password } = req.body;

    const UserAccountModel =
      mongoose.models.users || mongoose.model("users", UserScheme);

    const user = await UserAccountModel.findOne({ username });

    if (!user) {
      return res.status(404).json({
        code: 404,
        message: "Account not found",
      });
    }

    if (user.status !== "active") {
      return res.status(403).json({
        code: 403,
        message: "Account is inactive",
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
const resetPassword = async (req, res) => {
  try {
    await connectToDatabase(CONNECTION_STRING);

    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res
        .status(400)
        .json({ code: 400, message: "Missing token or password" });
    }
    console.log(`Token ${token}`);
    console.log("Decoded token:", jwt.decode(token));
    let payload;
    try {
      payload = jwt.verify(token, SIGNER_KEY);
    } catch (err) {
      console.error("Token verify failed:", err.message);

      return res
        .status(401)
        .json({ code: 401, message: "Invalid or expired token" });
    }

    if (payload.purpose !== "reset") {
      return res
        .status(400)
        .json({ code: 400, message: "Invalid token purpose" });
    }

    const user = await UserModel.findOne({ email: payload.email });
    if (!user) {
      return res.status(404).json({ code: 404, message: "User not found" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ code: 200, message: "Password reset successfully" });
  } catch (error) {
    console.error("resetPassword error:", error.message);
    res.status(500).json({ code: 500, message: error.message });
  }
};
const inactivateAccount = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ code: 400, message: "Missing id" });
    }

    await mongoose.connect(CONNECTION_STRING);
    const UserAccountModel =
      mongoose.models.users || mongoose.model("users", UserScheme);

    const user = await UserAccountModel.findById(id);
    if (!user) {
      return res.status(404).json({ code: 404, message: "User not found" });
    }

    user.status = "inactive";
    await user.save();

    res.status(200).json({
      code: 200,
      message: `Account with id "${id}" has been inactivated.`,
    });
  } catch (error) {
    console.error("Error in inactivateAccount:", error.message);
    res.status(500).json({ code: 500, message: error.message });
  }
};
const activateAccount = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ code: 400, message: "Missing id" });
    }

    await mongoose.connect(CONNECTION_STRING);
    const UserAccountModel =
      mongoose.models.users || mongoose.model("users", UserScheme);

    const user = await UserAccountModel.findById(id);
    if (!user) {
      return res.status(404).json({ code: 404, message: "User not found" });
    }

    user.status = "active";
    await user.save();

    res.status(200).json({
      code: 200,
      message: `Account with id "${id}" has been activated.`,
    });
  } catch (error) {
    console.error("Error in activateAccount:", error.message);
    res.status(500).json({ code: 500, message: error.message });
  }
};

module.exports = {
  createAccountRequest,
  Login,
  forgotPasswordRequest,
  resetPassword,
  inactivateAccount,
  activateAccount,
};

const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const { getRandomAlphanumericString } = require("../config/randomAccount.js");
const { ErrorMessage } = require("../dto/errorHandleDTO");
const { hashPassword } = require("../middleware/hashPassword.js");
const { UserScheme } = require("../dto/accountResponeDTO.js");
const {
  emailSendService,
  fotgotPasswordEmailSender,
} = require("../config/configMailSender.js");
const { AccountDTO } = require("../dto/accountDTO.js");
const CONNECTION_STRING = process.env.MONGODB_URI;
const handleHelloWorldsRequest = () => {
  res.send("Hello worlds");
};
const createAccountRequest = async (req, res) => {
  try {
    mongoose.connect(CONNECTION_STRING);
    const UserSchema = UserScheme;
    const activatecode = getRandomAlphanumericString();
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
      activatecode: activatecode,
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
      message: "Error connecting to the database or handling request",
    };
    const errorMsg = new ErrorMessage(status, data);
    res.status(status).send(errorMsg);
  }
};
const forgotPasswordRequest = async (req, res) => {
  const { email } = req.body;
  console.log(email);
  mongoose.connect(CONNECTION_STRING);
  mongoose.Collection("users").fotgotPasswordEmailSender(email);
};
module.exports = {
  handleHelloWorldsRequest,
  createAccountRequest,
};

const mongoose = require("mongoose");
const CONNECTION_STRING = process.env.MONGODB_URI;
const { databaseConfiguration } = require("../config/configDatabase.js");
const passwordValidate = process.env.PASSWORD_VALIDATION;
const handleHelloWorldsRequest = () => {
  res.send("Hello worlds");
};
const createAccountRequest = async (req, res) => {
  try {
    databaseConfiguration();
    console.log("Tới 1");
    const Schema = mongoose.Schema;
    const objectID = Schema.ObjectId;
    console.log("Tới 2");
    const UserSchema = new Schema({
      _id: { type: Schema.Types.ObjectId, auto: true },
      username: {
        type: String,
        unique: true,
        require: true,
        min: [6, "{VALUE} be at least 6 characters"],
        max: [20, "{VALUE} be less than 20 characters"],
      },
      password: {
        type: String,
        require: true,
        validate: {
          validate: function (v) {
            return passwordValidate.test(v);
          },
          message: (props) => `${props.value} is not available`,
        },
        min: [6, "{VALUE} be at least 6 characters"],
        max: [20, "{VALUE} be less than 20 characters"],
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
          message: (props) => `${props.value} is not a valid email address!`,
        },
      },
    });

    const UserAccountModel = mongoose.model("users", UserSchema);
    const { username, password, email } = req.body;
    if (!username || !password || !email) {
      console.log("Missing feild data");
      return res.status(400).send("Missing required fields");
    }
    const NewAccount = new UserAccountModel({
      username: username,
      password: password,
      email: email,
    });
    console.log("Tới 3");
    await NewAccount.save();
    res.status(200).send("Create user succesfully");
    console.log("Tới 4");
  } catch (error) {
    res
      .status(500)
      .send("Error connecting to the database or handling request");
  }
};

module.exports = {
  handleHelloWorldsRequest,
  createAccountRequest,
};

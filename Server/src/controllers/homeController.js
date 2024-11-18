const mongoose = require("mongoose");
const { databaseConfiguration } = require("../config/configDatabase.js");
const passwordValidate = process.env.PASSWORD_VALIDATION;
const createAccountRequest = async (req, res) => {
  try {
    await databaseConfiguration();
    const Schema = mongoose.Schema;
    const objectID = Schema.ObjectId;
    const ExampleSchema = new Schema({
      _id: { type: Schema.Types.ObjectId, auto: true },
      username: {
        type: String,
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
        },
        min: [6, "{VALUE} be at least 6 characters"],
        max: [20, "{VALUE} be less than 20 characters"],
      },
    });

    const ExampleModel = mongoose.model("users", ExampleSchema, "courses");
    const newUser = new ExampleModel({
      username: "xample",
      password: "hashed_code",
    });
    newUser
      .save()
      .then(() => res.send("User saved"))
      .catch((err) => res.send("Somethings wrongs", err));
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

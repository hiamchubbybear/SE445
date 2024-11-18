const mongoose = require("mongoose");
const { databaseConfiguration } = require("../config/configDatabase.js");
const handleHelloWorldsRequest = (req, res) => {
  res.send("Hello Worlds");
};

const createAccountRequest = async (req, res) => {
  try {
    await databaseConfiguration();
    const Schema = mongoose.Schema;
    const objectID = Schema.ObjectId;
    const ExampleSchema = new Schema({
      _id: { type: Schema.Types.ObjectId, auto: true },
      username: String,
      password: String,
    });

    const ExampleModel = mongoose.model("users", ExampleSchema, "courses");
    const newUser = new ExampleModel({
      username: "xample",
      password: "hashed_code",
    });
    newUser
      .save()
      .then(() => {
        res.send("User saved"), console.log("User saved");
      })
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

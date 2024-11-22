const Mongooose = require("mongoose");

function connectToDatabase(CONNECTION_STRING) {
  mongoose
    .connect(CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("Connected to the database"))
    .catch((err) => console.error("Database connection error:", err));
}

const LoginSchema = new Mongooose.Schema({
  username: {
    type: String,
    // unique: true,
    require: true,
  },
  password: {
    type: String,
    required: true,
  },
});
module.exports = {
  LoginSchema,
};

const bcrypt = require("bcrypt");
const saltRounds = 10;
function encryptPassword(password, encryptPassword) {
  bcrypt.compare(password, encryptPassword, function (err, result) {
    if (!err) return result;
    else {
      res.send(err.message());
    }
  });
}

module.exports = {
  encryptPassword,
};

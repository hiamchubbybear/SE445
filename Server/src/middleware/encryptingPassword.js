const bcrypt = require("bcrypt");
const saltRounds = 10;
const encryptPassword = (password, encryptPassword) => {
  bcrypt.compare(password, encryptPassword, function (err, result) {
    if (!err) return result;
  });
};

module.exports = {
  encryptPassword,
};

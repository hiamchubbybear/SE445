const { getDefaultHighWaterMark } = require("nodemailer/lib/xoauth2");

function getRandomAlphanumericString() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}
module.exports = {
  getRandomAlphanumericString,
};

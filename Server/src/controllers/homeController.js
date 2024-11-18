const handleHelloWorldsRequest = (req, res) => {
  res.send("Hello Worlds");
};
const homepageRequest = (req, res) => {
  res.send("This is CS445 Homepage Respone");
};
module.exports = {
  handleHelloWorldsRequest,
  homepageRequest,
};

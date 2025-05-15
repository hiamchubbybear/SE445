const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(401).json({ message: "Access Denied. No token provided." });
  }
  const rawToken = token.startsWith("Bearer ") ? token.slice(7) : token;
  try {
    const decoded = jwt.verify(rawToken, process.env.SIGNER_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token." });
  }
};

module.exports = {
  verifyToken
};

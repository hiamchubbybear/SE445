const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res
      .status(401)
      .json({ message: "Access Denied. No token provided." });
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

const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ message: `Requires ${role} role.` });
    }
    next();
  };
};

const requireScope = (scope) => {
  return (req, res, next) => {
    if (!req.user || !req.user.scope || !req.user.scope.includes(scope)) {
      return res.status(403).json({ message: `Requires scope: ${scope}` });
    }
    next();
  };
};

module.exports = {
  verifyToken,
  requireRole,
  requireScope,
};

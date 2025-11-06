const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader) return res.status(401).json({ error: "Access denied. No token provided." });

  // Extract token from "Bearer <token>"
  const token = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : authHeader;
  
  if (!token) return res.status(401).json({ error: "Access denied. Invalid token format." });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

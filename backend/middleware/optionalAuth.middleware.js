const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function optionalProtect(req, res, next) {
  try {
    const authHeader = req.headers.authorization || "";
    if (!authHeader.startsWith("Bearer ")) {
      return next();
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (user) {
      req.user = user;
    }
  } catch {
    // Invalid or expired token — treat as unauthenticated, don't block.
  }
  next();
}

module.exports = { optionalProtect };

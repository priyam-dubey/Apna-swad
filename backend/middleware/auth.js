// backend/middleware/auth.js
import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
  // BUG FIX #1: Accept token from both "token" header (legacy) and
  // standard "Authorization: Bearer <token>" header for compatibility.
  const token =
    req.headers["token"] ||
    (req.headers["authorization"] || "").replace(/^Bearer\s+/i, "");

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Not Authorized. Please login again." });
  }

  // BUG FIX #2: JWT_SECRET missing at runtime causes silent crash.
  // Fail-fast with a clear 500 rather than an unhandled exception.
  if (!process.env.JWT_SECRET) {
    console.error("FATAL: JWT_SECRET environment variable is not set.");
    return res
      .status(500)
      .json({ success: false, message: "Server configuration error." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach userId so downstream controllers can read req.body.userId
    req.body.userId = decoded.id;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error.message);
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired token. Please login again." });
  }
};

export default authMiddleware;

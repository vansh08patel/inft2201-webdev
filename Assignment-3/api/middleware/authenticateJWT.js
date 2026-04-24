const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET || "VanshxPatel";

// TODO: Implement authenticateJWT middleware for Assignment 3.
// Requirements:
// - Read the Authorization header: "Bearer <token>".
// - Verify the token using jwt.verify and SECRET.
// - If valid, attach the decoded payload to req.user.
// - If missing/invalid/expired, pass an appropriate error into next(err)
//   (do NOT send the response directly here — let errorHandler.js do that).

module.exports = function authenticateJWT(req, res, next) {
  // TODO: implement
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next({
      statusCode: 401,
      error: "AuthenticationError",
      message: "Missing or invalid token",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return next({
      statusCode: 401,
      error: "AuthenticationError",
      message: "Invalid or expired token",
    });
  }
};
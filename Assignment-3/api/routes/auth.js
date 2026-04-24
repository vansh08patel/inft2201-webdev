const express = require("express");
const jwt = require("jsonwebtoken");
const users = require("../data/users"); // ✅ correct (array)

const router = express.Router();
const SECRET = process.env.JWT_SECRET || "VanshxPatel";

// POST /auth/login
router.post("/login", (req, res, next) => {
  const { username, password } = req.body;

  // 🚨 check body exists
  if (!username || !password) {
    return next({
      statusCode: 400,
      error: "BadRequest",
      message: "Username and password are required",
    });
  }

  // 🔍 Find user
  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  // ❌ Invalid credentials
  if (!user) {
    return next({
      statusCode: 401,
      error: "AuthenticationError",
      message: "Invalid username or password",
    });
  }

  // ✅ Create JWT
  const token = jwt.sign(
    {
      userId: user.id,
      role: user.role,
    },
    SECRET,
    { expiresIn: "1h" }
  );

  // ✅ Return token
  res.json({ token });
});

module.exports = router;
const express = require("express");

const requestLogger = require("./middleware/requestLogger");
const rateLimit = require("./middleware/rateLimit"); // ✅ REQUIRED
const errorHandler = require("./middleware/errorHandler");

const authRoutes = require("./routes/auth");
const mailRoutes = require("./routes/mail");
const statusRoutes = require("./routes/status");

const app = express();

// Parse JSON body (REQUIRED for login)
app.use(express.json());

// Attach request logger (adds requestId + logs)
app.use(requestLogger);

// Apply rate limiting globally
app.use(rateLimit); // ✅ REQUIRED FOR PART 4

// Routes
app.use("/status", statusRoutes);
app.use("/auth", authRoutes);
app.use("/mail", mailRoutes);

// Centralized error handler MUST be last
app.use(errorHandler);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Assignment 3 API listening on port ${PORT}`);
});
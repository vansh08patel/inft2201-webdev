// Simple in-memory store for tracking requests per key (IP)
const requests = {};

module.exports = function rateLimit(req, res, next) {
  const key = req.ip; // can also use req.user?.userId later

  const now = Date.now();
  const windowMs = (process.env.RATE_LIMIT_WINDOW_SECONDS || 60) * 1000;
  const max = parseInt(process.env.RATE_LIMIT_MAX || "5");

  // Initialize if not exists
  if (!requests[key]) {
    requests[key] = [];
  }

  // Remove timestamps outside the window
  requests[key] = requests[key].filter(
    (time) => now - time < windowMs
  );

  // Check limit
  if (requests[key].length >= max) {
    return next({
      statusCode: 429,
      error: "RateLimitExceeded",
      message: "Too many requests",
    });
  }

  // Add current request timestamp
  requests[key].push(now);

  next();
};
// Centralized error handler.
// This MUST be the last middleware in server.js

module.exports = function errorHandler(err, req, res, next) {
  // Use provided statusCode or default to 500
  const statusCode = err.statusCode || 500;

  // Log error WITH requestId (important for tracing)
  console.error(
    `Unhandled error for request ${req.requestId}`,
    err
  );

  // Send consistent JSON response (assignment requirement)
  res.status(statusCode).json({
    error: err.error || "InternalServerError", // error category
    message: err.message || "An unexpected error occurred.", // safe message
    statusCode: statusCode,
    requestId: req.requestId || null, // include request ID
    timestamp: new Date().toISOString() // ISO timestamp
  });
};
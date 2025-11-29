// middleware/dbCheck.js
const mongoose = require('mongoose');

/**
 * Check if MongoDB is connected
 * @returns {boolean} True if connected, false otherwise
 */
function isDatabaseConnected() {
  return mongoose.connection.readyState === 1; // 1 = connected
}

/**
 * Middleware to check database connection before processing request
 * Returns 503 if database is not connected
 */
function requireDatabase(req, res, next) {
  if (!isDatabaseConnected()) {
    return res.status(503).json({
      error: 'Database connection unavailable',
      message: 'The database is not connected. Please check your MongoDB connection and try again.',
      retryAfter: 30 // seconds
    });
  }
  next();
}

/**
 * Middleware that allows request to proceed but attaches db status to request
 * Useful for routes that can work with or without database
 */
function checkDatabaseStatus(req, res, next) {
  req.dbConnected = isDatabaseConnected();
  next();
}

module.exports = {
  isDatabaseConnected,
  requireDatabase,
  checkDatabaseStatus
};


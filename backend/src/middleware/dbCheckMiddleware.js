const mongoose = require('mongoose');

/**
 * Middleware to check if MongoDB connection is active
 * If disconnected, responds immediately with 503 instead of hanging on buffer timeout
 */
const checkDbConnection = (req, res, next) => {
  // Allow health endpoint to pass through
  if (req.path === '/health') {
    return next();
  }

  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message:
        'Database is not connected. Please configure your MongoDB Atlas connection string in backend/.env (MONGODB_URI).',
    });
  }

  next();
};

module.exports = checkDbConnection;

// middleware/errorHandler.js
// Central error handling middleware — catches all errors thrown in routes

const errorHandler = (err, req, res, next) => {
  // Log error details to console (in production use a logger like Winston)
  console.error(`[ERROR] ${req.method} ${req.originalUrl}`);
  console.error(err.stack || err.message);

  // Mongoose validation error (e.g. required field missing)
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: messages,
    });
  }

  // Mongoose duplicate key error (e.g. email already subscribed)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({
      success: false,
      error: `${field} already exists`,
    });
  }

  // Mongoose cast error (e.g. invalid ObjectId in URL params)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      error: `Invalid value for field: ${err.path}`,
    });
  }

  // Default: Internal Server Error
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error',
  });
};

module.exports = errorHandler;
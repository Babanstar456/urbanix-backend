// middleware/requestLogger.js
// Simple request logger — logs every incoming API request with timestamp

const requestLogger = (req, res, next) => {
  const time = new Date().toISOString();
  console.log(`[${time}] ${req.method} ${req.originalUrl}`);
  next();
};

module.exports = requestLogger;
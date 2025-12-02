const { sendError } = require('../utils/response');

/**
 * Global error handling middleware
 */
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Default error
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Handle specific error types
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = err.message;
  }

  if (err.name === 'UnauthorizedError') {
    statusCode = 401;
    message = 'Unauthorized';
  }

  return sendError(res, message, statusCode);
};

/**
 * 404 Not Found middleware
 */
const notFound = (req, res, next) => {
  return sendError(res, 'Route not found', 404);
};

module.exports = {
  errorHandler,
  notFound,
};


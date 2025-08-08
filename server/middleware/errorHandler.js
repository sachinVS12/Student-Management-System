/**
 * Custom error handler middleware for Express
 * Handles different types of errors and sends appropriate responses
 */

const errorHandler = (err, req, res, next) => {
  console.error(err.stack); // Log the error stack trace for debugging

  // Default error response
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errors = null;

  // Handle different types of errors
  switch (err.name) {
    // Mongoose validation error
    case 'ValidationError':
      statusCode = 400;
      message = 'Validation Error';
      errors = {};
      Object.keys(err.errors).forEach((key) => {
        errors[key] = err.errors[key].message;
      });
      break;

    // Mongoose duplicate key error
    case 'MongoServerError':
      if (err.code === 11000) {
        statusCode = 409;
        message = 'Duplicate Field Value Entered';
        const field = Object.keys(err.keyValue)[0];
        errors = {
          [field]: `${field} must be unique`
        };
      }
      break;

    // JWT errors
    case 'JsonWebTokenError':
      statusCode = 401;
      message = 'Invalid Token';
      break;

    case 'TokenExpiredError':
      statusCode = 401;
      message = 'Token Expired';
      break;

    // Custom API errors
    case 'ApiError':
      // Use the existing status code and message
      errors = err.errors || null;
      break;

    // Default case for other errors
    default:
      // Handle specific status codes if they exist
      if (err.status) {
        statusCode = err.status;
      }
  }

  // Development vs production error response
  const response = {
    success: false,
    message,
    ...(errors && { errors }),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  };

  res.status(statusCode).json(response);
};

module.exports = errorHandler;
/**
 * Custom error handler for API responses
 * @param {Error} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const errorHandler = (err, req, res, next) => {
  // Log error for debugging
  console.error(err.stack)

  // Default error status and message
  let statusCode = err.statusCode || 500
  let message = err.message || "Server Error"

  // Handle Mongoose validation errors
  if (err.name === "ValidationError") {
    statusCode = 400
    const errors = {}

    // Extract validation error messages
    for (const field in err.errors) {
      errors[field] = err.errors[field].message
    }

    return res.status(statusCode).json({
      success: false,
      message: "Validation Error",
      errors,
    })
  }

  // Handle Mongoose duplicate key errors
  if (err.code === 11000) {
    statusCode = 400
    message = `Duplicate field value: ${Object.keys(err.keyValue).join(", ")}`
  }

  // Handle Mongoose cast errors (invalid ObjectId, etc.)
  if (err.name === "CastError") {
    statusCode = 400
    message = `Invalid ${err.path}: ${err.value}`
  }

  // Handle JWT errors
  if (err.name === "JsonWebTokenError") {
    statusCode = 401
    message = "Invalid token"
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401
    message = "Token expired"
  }

  // Handle file upload errors
  if (err.code === "LIMIT_FILE_SIZE") {
    statusCode = 400
    message = "File too large"
  }

  if (err.code === "LIMIT_UNEXPECTED_FILE") {
    statusCode = 400
    message = "Too many files uploaded"
  }

  if (err.code === "ENOENT") {
    statusCode = 404
    message = "File not found"
  }

  // Send error response
  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  })
}

/**
 * Async handler to avoid try-catch blocks in controllers
 * @param {Function} fn - Async function to handle
 * @returns {Function} - Express middleware function
 */
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/**
 * Create a custom error with status code
 * @param {String} message - Error message
 * @param {Number} statusCode - HTTP status code
 * @returns {Error} - Custom error object
 */
const createError = (message, statusCode) => {
  const error = new Error(message)
  error.statusCode = statusCode
  return error
}

module.exports = {
  errorHandler,
  asyncHandler,
  createError,
}

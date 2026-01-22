// export default class ErrorHandler extends Error {
//   constructor(message, statusCode = 500) {
//     super(message);
//     this.statusCode = statusCode;
//   }
// }

// export const errorMiddleware = (err, req, res, next) => {
//   const statusCode = err.statusCode || 500;
//   const message = err.message || "Server Error";
//   res.status(statusCode).json({ success: false, message });
// };

// middlewares/error.js
class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default ErrorHandler;

export const errorMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  // Log error for debugging
  console.error("Error:", {
    message: err.message,
    statusCode: err.statusCode,
    stack: err.stack,
  });

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    err.message = `${field} already exists`;
    err.statusCode = 400;
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    err.message = messages.join(", ");
    err.statusCode = 400;
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    err.message = "Invalid token";
    err.statusCode = 401;
  }

  if (err.name === "TokenExpiredError") {
    err.message = "Token expired";
    err.statusCode = 401;
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};
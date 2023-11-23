class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor); // This will not appear in the stack trace and will not pollute it. It means that when we create a new object and call this constructor function, then the constructor function call will not appear in the stack trace and will not pollute it.
  }
}
module.exports = AppError;

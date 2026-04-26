


export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};



export const errorHandler = (err, req, res, _next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  const response = { message };
  if (process.env.NODE_ENV === "development") {
    response.stack = err.stack;
  }

  console.error(`[ERROR] ${req.method} ${req.originalUrl} → ${statusCode}: ${message}`);
  res.status(statusCode).json(response);
};



export class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

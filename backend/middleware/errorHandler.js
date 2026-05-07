function errorHandler(err, req, res, next) {
  // Normalise non-Error throws (strings, plain objects, etc.)
  if (typeof err === "string") err = new Error(err);
  else if (err && typeof err === "object" && !err.message && err.http_code) {
    err = Object.assign(new Error(err.name || "Upload error"), err);
  }

  let statusCode =
    (err.statusCode && Number.isInteger(err.statusCode) ? err.statusCode : null) ||
    (res.statusCode && res.statusCode !== 200 ? res.statusCode : null) ||
    500;
  let message = err.message || "Internal server error";

  if (err.name === "ValidationError" && err.errors) {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join("; ");
  } else if (err.code === 11000 && err.keyValue) {
    statusCode = 400;
    message = `Duplicate value for ${JSON.stringify(err.keyValue)}`;
  } else if (err.code === 11000) {
    statusCode = 400;
    message = err.message || "Duplicate key";
  } else if (err.name === "MulterError") {
    statusCode = 400;
    message = err.message || "Upload error";
  }

  if (statusCode === 500 && process.env.NODE_ENV !== "production") {
    console.error("[error]", err.name, err.code || "", message);
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
}

module.exports = { errorHandler };

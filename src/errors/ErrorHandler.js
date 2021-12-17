const AppError = require('./AppError');
const log = require('npmlog');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = Object.keys(err.keyValue)[0];
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError('Invalid token. Please log in again!', 401);

const handleJWTExpiredError = () =>
  new AppError('Your token has expired! Please log in again.', 401);

module.exports = (err, req, res, next) => {
  log.error(err.name, err);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (req.originalUrl.startsWith('/api')) {
    let error = { ...err };
    error.message = err.message;
    if (err.name === 'CastError') error = handleCastErrorDB(error);
    if (err.code === 11000) error = handleDuplicateFieldsDB(error);
    if (err.name === 'ValidationError') error = handleValidationErrorDB(error);
    if (err.name === 'JsonWebTokenError') error = handleJWTError();
    if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();
    return res.status(error.statusCode).json({
      status: error.status,
      data: error,
      message: error.message,
      statusCode: error.statusCode,
    });
  }
  return res.status(err.statusCode).json({
    status: err.status,
    data: null,
    message: 'Something went wrong, please contact admin!',
    statusCode: err.statusCode,
  });
};

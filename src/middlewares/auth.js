const jwt = require('jsonwebtoken');
const AppError = require('./../errors/AppError');
const config = require('./../../config');

exports.auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    let decodedData = jwt.verify(token.toString(), config.JWT_SECRET);
    req.userId = decodedData._id;
    next();
  } catch (error) {
    return next(new AppError('Action requires logging in!', 401));
  }
};

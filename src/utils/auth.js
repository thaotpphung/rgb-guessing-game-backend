const jwt = require('jsonwebtoken');
const config = require('../../config');

exports.getToken = (user) => {
  return jwt.sign({ _id: user._id }, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRES_IN,
  });
};

const bcrypt = require('bcryptjs');
const User = require('../models/users.js');
const authService = require('../utils/auth.js');
const catchAsync = require('../utils/catchAsync');
const AppError = require('./../errors/AppError');

const sendTokenResponse = (user, statusCode, message, req, res) => {
  user.password = undefined;
  const token = authService.getToken(user);
  res.status(statusCode).json({
    status: 'success',
    data: {
      result: user,
      token: token,
    },
    message: message,
  });
};

exports.signin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  // check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email or password', 400));
  }
  // check if user exists and password is correct
  const user = await User.findOne({ email }).select('+password').exec();
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new AppError('Invalid credentials', 401));
  }
  // send token
  sendTokenResponse(user, 200, 'Successfully signed in!', req, res);
});

exports.signup = catchAsync(async (req, res, next) => {
  const { email, password, name } = req.body;
  // check if email or username already exist
  const oldUser = await User.findOne({ email }).exec();
  if (oldUser) return next(new AppError('Email must be unique', 400));
  // save user
  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });
  sendTokenResponse(user, 200, 'Successfully signed up', req, res);
});

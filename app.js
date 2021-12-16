const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const compression = require('compression');
const cors = require('cors');
const AppError = require('./src/errors/AppError');
const globalErrorHandler = require('./src/errors/ErrorHandler');
const authRoutes = require('./src/routes/auth.js');
const gameRoutes = require('./src/routes/games.js');
const scoreRoutes = require('./src/routes/scores.js');
const userRoutes = require('./src/routes/users.js');
const config = require('./config');
const app = express();

// Development logging
if (config.NODE_ENV === 'local') {
  app.use(morgan('dev'));
}

// SECURITY
app.use(cors());

// Set security HTTP headers
app.use(helmet());

// limit requests from same API
const limiter = rateLimit({
  max: 200, // start blocking after 200 requests
  windowMs: 60 * 60 * 1000, // 1 hour window
  message:
    'Too many requests from this IP address, please try again in an hour!',
});

config.NODE_ENV !== 'local' && app.use('/api', limiter);

// body paser, reading data from body into req body
app.use(express.urlencoded({ limit: '30mb', extended: true }));
app.use(express.json({ limit: '30mb', extended: true }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

app.use(compression());

// ROUTES
app.use('/api/', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/scores', scoreRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to RGB guessing game API!');
});

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;

const dotenv = require('dotenv');
dotenv.config();

let NODE_ENV = process.env.NODE_ENV;
let DB_CONNECTION = process.env.MONGODB_LOCAL;
let PORT = process.env.PORT || 5000;
let JWT_SECRET = process.env.JWT_SECRET || 'local';
let JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '365d';

switch (process.env.NODE_ENV) {
  case 'production': {
    DB_CONNECTION = process.env.MONGODB_PRODUCTION;
    break;
  }
  default:
}

module.exports = {
  NODE_ENV,
  DB_CONNECTION,
  PORT,
  JWT_SECRET,
  JWT_EXPIRES_IN,
};

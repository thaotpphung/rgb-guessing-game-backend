const mongoose = require('mongoose');
const log = require('npmlog');
const config = require('./config');

process.on('uncaughtException', (err) => {
  log.error('UncaughtException', err);
  process.exit(1);
});

mongoose
  .connect(config.DB_CONNECTION, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => log.info(`DB connection successful`));

const app = require('./app');

const server = app.listen(config.PORT, () => {
  log.info(`App running on port ${config.PORT}`);
});

const io = require('./src/utils/socket').init(server);
io.on('connection', (socket) => {
  log.info('Client connected');
});

process.on('unhandledRejection', (err) => {
  log.error('UNHANDLED REJECTION!', err);
  server.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  log.error('👋 SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    log.error('💥 Process terminated!');
  });
});

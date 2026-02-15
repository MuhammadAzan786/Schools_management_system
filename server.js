require('dotenv').config();
const validateEnv = require('./config/validateEnv');
const logger = require('./utils/logger');
const app = require('./app');
const config = require('./config/config');
const connectDB = require('./config/database');

validateEnv();

connectDB();

const PORT = config.port;

const server = app.listen(PORT, () => {
  logger.info(`Server running in ${config.nodeEnv} mode on port ${PORT}`);
});

process.on('unhandledRejection', (err) => {
  logger.error(`Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('Process terminated');
  });
});

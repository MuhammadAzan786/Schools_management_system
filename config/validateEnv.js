const logger = require('../utils/logger');

const validateEnv = () => {
  const requiredEnvVars = [
    'MONGODB_URI',
    'JWT_SECRET',
    'PORT'
  ];

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    logger.error(`Missing required environment variables: ${missingVars.join(', ')}`);
    process.exit(1);
  }

  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    logger.warn('JWT_SECRET should be at least 32 characters for better security');
  }

  logger.info('Environment variables validated successfully');
};

module.exports = validateEnv;

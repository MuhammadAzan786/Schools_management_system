const getTimestamp = () => {
  return new Date().toISOString();
};

const info = (message, meta = {}) => {
  console.log(`[${getTimestamp()}] [INFO] ${message}`, meta);
};

const error = (message, meta = {}) => {
  console.error(`[${getTimestamp()}] [ERROR] ${message}`, meta);
};

const warn = (message, meta = {}) => {
  console.warn(`[${getTimestamp()}] [WARN] ${message}`, meta);
};

const debug = (message, meta = {}) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[${getTimestamp()}] [DEBUG] ${message}`, meta);
  }
};

module.exports = {
  info,
  error,
  warn,
  debug
};

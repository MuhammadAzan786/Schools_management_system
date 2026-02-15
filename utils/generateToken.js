const jwt = require('jsonwebtoken');
const config = require('../config/config');

const generateToken = (payload) => {
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpire
  });
};

module.exports = generateToken;

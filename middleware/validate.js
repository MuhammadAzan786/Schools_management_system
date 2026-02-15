const { validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(e => e.msg).join(', ');
    res.status(400);
    return next(new Error(errorMessages));
  }

  next();
};

module.exports = validate;

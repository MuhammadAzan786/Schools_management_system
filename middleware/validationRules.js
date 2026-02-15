const { body, param } = require('express-validator');

const nameValidation = body('name')
  .trim()
  .notEmpty()
  .withMessage('Name is required')
  .isLength({ max: 50 })
  .withMessage('Name cannot exceed 50 characters');

const emailValidation = body('email')
  .trim()
  .notEmpty()
  .withMessage('Email is required')
  .isEmail()
  .withMessage('Please provide a valid email')
  .normalizeEmail();

const passwordValidation = body('password')
  .notEmpty()
  .withMessage('Password is required')
  .isLength({ min: 6 })
  .withMessage('Password must be at least 6 characters long');

const roleValidation = body('role')
  .notEmpty()
  .withMessage('Role is required')
  .isIn(['superadmin', 'schooladmin'])
  .withMessage('Role must be either superadmin or schooladmin');

const mongoIdValidation = (field) =>
  body(field)
    .notEmpty()
    .withMessage(`${field} is required`)
    .isMongoId()
    .withMessage(`Invalid ${field} format`);

const mongoIdParamValidation = param('id')
  .isMongoId()
  .withMessage('Invalid ID format');

const firstNameValidation = body('firstName')
  .trim()
  .notEmpty()
  .withMessage('First name is required')
  .isLength({ max: 50 })
  .withMessage('First name cannot exceed 50 characters');

const lastNameValidation = body('lastName')
  .trim()
  .notEmpty()
  .withMessage('Last name is required')
  .isLength({ max: 50 })
  .withMessage('Last name cannot exceed 50 characters');

const ageValidation = body('age')
  .notEmpty()
  .withMessage('Age is required')
  .isInt({ min: 3, max: 100 })
  .withMessage('Age must be a number between 3 and 100');

const capacityValidation = body('capacity')
  .notEmpty()
  .withMessage('Capacity is required')
  .isInt({ min: 1, max: 500 })
  .withMessage('Capacity must be a number between 1 and 500');

module.exports = {
  nameValidation,
  emailValidation,
  passwordValidation,
  roleValidation,
  mongoIdValidation,
  mongoIdParamValidation,
  firstNameValidation,
  lastNameValidation,
  ageValidation,
  capacityValidation
};

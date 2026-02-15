const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const generateToken = require('../utils/generateToken');
const { sendSuccess } = require('../utils/response');

const register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role, school } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    return next(new Error('User already exists with this email'));
  }

  if (role === 'schooladmin' && !school) {
    res.status(400);
    return next(new Error('School is required for schooladmin role'));
  }

  if (role === 'superadmin' && school) {
    res.status(400);
    return next(new Error('Superadmin cannot be assigned to a school'));
  }

  const user = await User.create({
    name,
    email,
    password,
    role,
    school: role === 'schooladmin' ? school : undefined
  });

  const token = generateToken({
    id: user._id,
    role: user.role,
    school: user.school
  });

  const data = {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    school: user.school,
    token
  };

  sendSuccess(res, 201, data, 'User registered successfully');
});

const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    res.status(401);
    return next(new Error('Invalid email or password'));
  }

  const isPasswordMatch = await user.matchPassword(password);

  if (!isPasswordMatch) {
    res.status(401);
    return next(new Error('Invalid email or password'));
  }

  const token = generateToken({
    id: user._id,
    role: user.role,
    school: user.school
  });

  const data = {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    school: user.school,
    token
  };

  sendSuccess(res, 200, data, 'Login successful');
});

const getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).populate('school', 'name');

  if (!user) {
    res.status(404);
    return next(new Error('User not found'));
  }

  sendSuccess(res, 200, user, 'User retrieved successfully');
});

module.exports = {
  register,
  login,
  getMe
};

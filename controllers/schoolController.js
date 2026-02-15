const School = require('../models/School');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess, sendSuccessWithPagination } = require('../utils/response');
const { getPagination, getPaginationMeta } = require('../utils/pagination');

const createSchool = asyncHandler(async (req, res, next) => {
  const { name, address, contactEmail } = req.body;

  const schoolExists = await School.findOne({ name });
  if (schoolExists) {
    res.status(400);
    return next(new Error('School with this name already exists'));
  }

  const school = await School.create({
    name,
    address,
    contactEmail,
    createdBy: req.user.id
  });

  sendSuccess(res, 201, school, 'School created successfully');
});

const getSchools = asyncHandler(async (req, res, next) => {
  const { page, limit, skip } = getPagination(req);

  let query;
  let countQuery;

  if (req.user.role === 'superadmin') {
    query = School.find();
    countQuery = School.countDocuments();
  } else if (req.user.role === 'schooladmin') {
    if (!req.user.school) {
      res.status(403);
      return next(new Error('School admin must be assigned to a school'));
    }
    query = School.find({ _id: req.user.school });
    countQuery = School.countDocuments({ _id: req.user.school });
  }

  const total = await countQuery;
  const schools = await query
    .populate('createdBy', 'name email')
    .sort('-createdAt')
    .skip(skip)
    .limit(limit);

  const pagination = getPaginationMeta(page, limit, total);

  sendSuccessWithPagination(res, 200, schools, pagination, 'Schools retrieved successfully');
});

const getSchool = asyncHandler(async (req, res, next) => {
  const school = await School.findById(req.params.id).populate('createdBy', 'name email');

  if (!school) {
    res.status(404);
    return next(new Error('School not found'));
  }

  if (req.user.role === 'schooladmin') {
    if (!req.user.school || req.user.school.toString() !== school._id.toString()) {
      res.status(403);
      return next(new Error('Not authorized to access this school'));
    }
  }

  sendSuccess(res, 200, school, 'School retrieved successfully');
});

const updateSchool = asyncHandler(async (req, res, next) => {
  let school = await School.findById(req.params.id);

  if (!school) {
    res.status(404);
    return next(new Error('School not found'));
  }

  const { name, address, contactEmail } = req.body;

  if (name && name !== school.name) {
    const schoolExists = await School.findOne({ name });
    if (schoolExists) {
      res.status(400);
      return next(new Error('School with this name already exists'));
    }
  }

  school = await School.findByIdAndUpdate(
    req.params.id,
    { name, address, contactEmail },
    { new: true, runValidators: true }
  );

  sendSuccess(res, 200, school, 'School updated successfully');
});

const deleteSchool = asyncHandler(async (req, res, next) => {
  const school = await School.findById(req.params.id);

  if (!school) {
    res.status(404);
    return next(new Error('School not found'));
  }

  await school.deleteOne();

  sendSuccess(res, 200, {}, 'School deleted successfully');
});

module.exports = {
  createSchool,
  getSchools,
  getSchool,
  updateSchool,
  deleteSchool
};

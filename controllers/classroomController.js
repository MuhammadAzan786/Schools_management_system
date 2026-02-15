const Classroom = require('../models/Classroom');
const School = require('../models/School');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess, sendSuccessWithPagination } = require('../utils/response');
const { getPagination, getPaginationMeta } = require('../utils/pagination');

const createClassroom = asyncHandler(async (req, res, next) => {
  const { name, capacity, school } = req.body;

  if (!req.user.school) {
    res.status(403);
    return next(new Error('School admin must be assigned to a school'));
  }

  if (school !== req.user.school.toString()) {
    res.status(403);
    return next(new Error('You can only create classrooms in your assigned school'));
  }

  const schoolExists = await School.findById(school);
  if (!schoolExists) {
    res.status(404);
    return next(new Error('School not found'));
  }

  const classroomExists = await Classroom.findOne({ name, school });
  if (classroomExists) {
    res.status(400);
    return next(new Error('Classroom with this name already exists in this school'));
  }

  const classroom = await Classroom.create({
    name,
    capacity,
    school
  });

  const populatedClassroom = await Classroom.findById(classroom._id).populate('school', 'name address');

  sendSuccess(res, 201, populatedClassroom, 'Classroom created successfully');
});

const getClassrooms = asyncHandler(async (req, res, next) => {
  const { page, limit, skip } = getPagination(req);

  let query;
  let countQuery;

  if (req.user.role === 'superadmin') {
    query = Classroom.find();
    countQuery = Classroom.countDocuments();
  } else if (req.user.role === 'schooladmin') {
    if (!req.user.school) {
      res.status(403);
      return next(new Error('School admin must be assigned to a school'));
    }
    query = Classroom.find({ school: req.user.school });
    countQuery = Classroom.countDocuments({ school: req.user.school });
  }

  const total = await countQuery;
  const classrooms = await query
    .populate('school', 'name address')
    .sort('-createdAt')
    .skip(skip)
    .limit(limit);

  const pagination = getPaginationMeta(page, limit, total);

  sendSuccessWithPagination(res, 200, classrooms, pagination, 'Classrooms retrieved successfully');
});

const getClassroom = asyncHandler(async (req, res, next) => {
  const classroom = await Classroom.findById(req.params.id).populate('school', 'name address');

  if (!classroom) {
    res.status(404);
    return next(new Error('Classroom not found'));
  }

  if (req.user.role === 'schooladmin') {
    if (!req.user.school || req.user.school.toString() !== classroom.school._id.toString()) {
      res.status(403);
      return next(new Error('Not authorized to access this classroom'));
    }
  }

  sendSuccess(res, 200, classroom, 'Classroom retrieved successfully');
});

const updateClassroom = asyncHandler(async (req, res, next) => {
  if (!req.user.school) {
    res.status(403);
    return next(new Error('School admin must be assigned to a school'));
  }

  let classroom = await Classroom.findById(req.params.id);

  if (!classroom) {
    res.status(404);
    return next(new Error('Classroom not found'));
  }

  if (req.user.school.toString() !== classroom.school.toString()) {
    res.status(403);
    return next(new Error('You can only update classrooms in your assigned school'));
  }

  const { name, capacity } = req.body;

  if (name && name !== classroom.name) {
    const classroomExists = await Classroom.findOne({ name, school: classroom.school });
    if (classroomExists) {
      res.status(400);
      return next(new Error('Classroom with this name already exists in this school'));
    }
  }

  classroom = await Classroom.findByIdAndUpdate(
    req.params.id,
    { name, capacity },
    { new: true, runValidators: true }
  ).populate('school', 'name address');

  sendSuccess(res, 200, classroom, 'Classroom updated successfully');
});

const deleteClassroom = asyncHandler(async (req, res, next) => {
  if (!req.user.school) {
    res.status(403);
    return next(new Error('School admin must be assigned to a school'));
  }

  const classroom = await Classroom.findById(req.params.id);

  if (!classroom) {
    res.status(404);
    return next(new Error('Classroom not found'));
  }

  if (req.user.school.toString() !== classroom.school.toString()) {
    res.status(403);
    return next(new Error('You can only delete classrooms in your assigned school'));
  }

  await classroom.deleteOne();

  sendSuccess(res, 200, {}, 'Classroom deleted successfully');
});

module.exports = {
  createClassroom,
  getClassrooms,
  getClassroom,
  updateClassroom,
  deleteClassroom
};

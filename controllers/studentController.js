const Student = require('../models/Student');
const Classroom = require('../models/Classroom');
const School = require('../models/School');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess, sendSuccessWithPagination } = require('../utils/response');
const { getPagination, getPaginationMeta } = require('../utils/pagination');

const createStudent = asyncHandler(async (req, res, next) => {
  const { firstName, lastName, age, classroom, school } = req.body;

  if (!req.user.school) {
    res.status(403);
    return next(new Error('School admin must be assigned to a school'));
  }

  if (school !== req.user.school.toString()) {
    res.status(403);
    return next(new Error('You can only create students in your assigned school'));
  }

  const schoolExists = await School.findById(school);
  if (!schoolExists) {
    res.status(404);
    return next(new Error('School not found'));
  }

  const classroomExists = await Classroom.findById(classroom);
  if (!classroomExists) {
    res.status(404);
    return next(new Error('Classroom not found'));
  }

  if (classroomExists.school.toString() !== school) {
    res.status(400);
    return next(new Error('Classroom does not belong to the specified school'));
  }

  const student = await Student.create({
    firstName,
    lastName,
    age,
    classroom,
    school
  });

  const populatedStudent = await Student.findById(student._id)
    .populate('school', 'name address')
    .populate('classroom', 'name capacity');

  sendSuccess(res, 201, populatedStudent, 'Student created successfully');
});

const getStudents = asyncHandler(async (req, res, next) => {
  const { page, limit, skip } = getPagination(req);

  let query;
  let countQuery;

  if (req.user.role === 'superadmin') {
    query = Student.find();
    countQuery = Student.countDocuments();
  } else if (req.user.role === 'schooladmin') {
    if (!req.user.school) {
      res.status(403);
      return next(new Error('School admin must be assigned to a school'));
    }
    query = Student.find({ school: req.user.school });
    countQuery = Student.countDocuments({ school: req.user.school });
  }

  const total = await countQuery;
  const students = await query
    .populate('school', 'name address')
    .populate('classroom', 'name capacity')
    .sort('-createdAt')
    .skip(skip)
    .limit(limit);

  const pagination = getPaginationMeta(page, limit, total);

  sendSuccessWithPagination(res, 200, students, pagination, 'Students retrieved successfully');
});

const getStudent = asyncHandler(async (req, res, next) => {
  const student = await Student.findById(req.params.id)
    .populate('school', 'name address')
    .populate('classroom', 'name capacity');

  if (!student) {
    res.status(404);
    return next(new Error('Student not found'));
  }

  if (req.user.role === 'schooladmin') {
    if (!req.user.school || req.user.school.toString() !== student.school._id.toString()) {
      res.status(403);
      return next(new Error('Not authorized to access this student'));
    }
  }

  sendSuccess(res, 200, student, 'Student retrieved successfully');
});

const updateStudent = asyncHandler(async (req, res, next) => {
  if (!req.user.school) {
    res.status(403);
    return next(new Error('School admin must be assigned to a school'));
  }

  let student = await Student.findById(req.params.id);

  if (!student) {
    res.status(404);
    return next(new Error('Student not found'));
  }

  if (req.user.school.toString() !== student.school.toString()) {
    res.status(403);
    return next(new Error('You can only update students in your assigned school'));
  }

  const { firstName, lastName, age } = req.body;

  student = await Student.findByIdAndUpdate(
    req.params.id,
    { firstName, lastName, age },
    { new: true, runValidators: true }
  )
    .populate('school', 'name address')
    .populate('classroom', 'name capacity');

  sendSuccess(res, 200, student, 'Student updated successfully');
});

const transferStudent = asyncHandler(async (req, res, next) => {
  if (!req.user.school) {
    res.status(403);
    return next(new Error('School admin must be assigned to a school'));
  }

  const student = await Student.findById(req.params.id);

  if (!student) {
    res.status(404);
    return next(new Error('Student not found'));
  }

  if (req.user.school.toString() !== student.school.toString()) {
    res.status(403);
    return next(new Error('You can only transfer students in your assigned school'));
  }

  const { newClassroom } = req.body;

  const classroom = await Classroom.findById(newClassroom);
  if (!classroom) {
    res.status(404);
    return next(new Error('New classroom not found'));
  }

  if (classroom.school.toString() !== student.school.toString()) {
    res.status(400);
    return next(new Error('Cannot transfer student to a classroom in a different school'));
  }

  if (student.classroom.toString() === newClassroom) {
    res.status(400);
    return next(new Error('Student is already in this classroom'));
  }

  student.classroom = newClassroom;
  await student.save();

  const updatedStudent = await Student.findById(student._id)
    .populate('school', 'name address')
    .populate('classroom', 'name capacity');

  sendSuccess(res, 200, updatedStudent, 'Student transferred successfully');
});

const deleteStudent = asyncHandler(async (req, res, next) => {
  if (!req.user.school) {
    res.status(403);
    return next(new Error('School admin must be assigned to a school'));
  }

  const student = await Student.findById(req.params.id);

  if (!student) {
    res.status(404);
    return next(new Error('Student not found'));
  }

  if (req.user.school.toString() !== student.school.toString()) {
    res.status(403);
    return next(new Error('You can only delete students in your assigned school'));
  }

  await student.deleteOne();

  sendSuccess(res, 200, {}, 'Student deleted successfully');
});

module.exports = {
  createStudent,
  getStudents,
  getStudent,
  updateStudent,
  transferStudent,
  deleteStudent
};

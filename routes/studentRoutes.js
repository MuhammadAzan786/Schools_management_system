const express = require('express');
const { body } = require('express-validator');
const {
  createStudent,
  getStudents,
  getStudent,
  updateStudent,
  transferStudent,
  deleteStudent
} = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * /api/students:
 *   get:
 *     summary: Get all students (Protected)
 *     description: Retrieve students with pagination. Superadmin sees all students, schooladmin sees only students in their school.
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Students retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginationResponse'
 *       401:
 *         description: Not authorized
 *       403:
 *         description: School admin must be assigned to a school
 *   post:
 *     summary: Create student (School admin only)
 *     description: Enroll a new student in a classroom within the school admin's assigned school.
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - age
 *               - classroom
 *               - school
 *             properties:
 *               firstName:
 *                 type: string
 *                 maxLength: 50
 *                 example: John
 *               lastName:
 *                 type: string
 *                 maxLength: 50
 *                 example: Doe
 *               age:
 *                 type: integer
 *                 minimum: 3
 *                 maximum: 100
 *                 example: 15
 *               classroom:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439020
 *               school:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439011
 *     responses:
 *       201:
 *         description: Student created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Validation error or classroom not in school
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Can only create students in assigned school
 *       404:
 *         description: School or classroom not found
 */
router
  .route('/')
  .get(protect, getStudents)
  .post(
    protect,
    authorize('schooladmin'),
    [
      body('firstName')
        .trim()
        .notEmpty()
        .withMessage('First name is required')
        .isLength({ max: 50 })
        .withMessage('First name cannot exceed 50 characters'),
      body('lastName')
        .trim()
        .notEmpty()
        .withMessage('Last name is required')
        .isLength({ max: 50 })
        .withMessage('Last name cannot exceed 50 characters'),
      body('age')
        .notEmpty()
        .withMessage('Age is required')
        .isInt({ min: 3, max: 100 })
        .withMessage('Age must be a number between 3 and 100'),
      body('classroom')
        .notEmpty()
        .withMessage('Classroom is required')
        .isMongoId()
        .withMessage('Invalid classroom ID format'),
      body('school')
        .notEmpty()
        .withMessage('School is required')
        .isMongoId()
        .withMessage('Invalid school ID format')
    ],
    createStudent
  );

/**
 * @swagger
 * /api/students/{id}:
 *   get:
 *     summary: Get single student (Protected)
 *     description: Retrieve a single student by ID. School admin can only access students in their school.
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Student ID
 *     responses:
 *       200:
 *         description: Student retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Not authorized to access this student
 *       404:
 *         description: Student not found
 *   put:
 *     summary: Update student (School admin only)
 *     description: Update student details in assigned school.
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Student ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 maxLength: 50
 *               lastName:
 *                 type: string
 *                 maxLength: 50
 *               age:
 *                 type: integer
 *                 minimum: 3
 *                 maximum: 100
 *     responses:
 *       200:
 *         description: Student updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Can only update students in assigned school
 *       404:
 *         description: Student not found
 *   delete:
 *     summary: Delete student (School admin only)
 *     description: Delete a student from assigned school.
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Student ID
 *     responses:
 *       200:
 *         description: Student deleted successfully
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Can only delete students in assigned school
 *       404:
 *         description: Student not found
 */
router
  .route('/:id')
  .get(protect, getStudent)
  .put(
    protect,
    authorize('schooladmin'),
    [
      body('firstName')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('First name cannot be empty')
        .isLength({ max: 50 })
        .withMessage('First name cannot exceed 50 characters'),
      body('lastName')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Last name cannot be empty')
        .isLength({ max: 50 })
        .withMessage('Last name cannot exceed 50 characters'),
      body('age')
        .optional()
        .isInt({ min: 3, max: 100 })
        .withMessage('Age must be a number between 3 and 100')
    ],
    updateStudent
  )
  .delete(protect, authorize('schooladmin'), deleteStudent);

/**
 * @swagger
 * /api/students/{id}/transfer:
 *   put:
 *     summary: Transfer student to another classroom (School admin only)
 *     description: Transfer a student to a different classroom within the same school. Cross-school transfers are prevented.
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Student ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newClassroom
 *             properties:
 *               newClassroom:
 *                 type: string
 *                 description: New classroom ID (must be in the same school)
 *                 example: 507f1f77bcf86cd799439021
 *     responses:
 *       200:
 *         description: Student transferred successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Cannot transfer to different school or already in classroom
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Can only transfer students in assigned school
 *       404:
 *         description: Student or new classroom not found
 */
router.put(
  '/:id/transfer',
  protect,
  authorize('schooladmin'),
  [
    body('newClassroom')
      .notEmpty()
      .withMessage('New classroom is required')
      .isMongoId()
      .withMessage('Invalid classroom ID format')
  ],
  transferStudent
);

module.exports = router;

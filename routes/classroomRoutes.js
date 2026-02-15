const express = require('express');
const { body } = require('express-validator');
const {
  createClassroom,
  getClassrooms,
  getClassroom,
  updateClassroom,
  deleteClassroom
} = require('../controllers/classroomController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * /api/classrooms:
 *   get:
 *     summary: Get all classrooms (Protected)
 *     description: Retrieve classrooms with pagination. Superadmin sees all classrooms, schooladmin sees only classrooms in their school.
 *     tags: [Classrooms]
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
 *         description: Classrooms retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginationResponse'
 *       401:
 *         description: Not authorized
 *       403:
 *         description: School admin must be assigned to a school
 *   post:
 *     summary: Create classroom (School admin only)
 *     description: Create a new classroom in the school admin's assigned school.
 *     tags: [Classrooms]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - capacity
 *               - school
 *             properties:
 *               name:
 *                 type: string
 *                 maxLength: 50
 *                 example: Room 101
 *               capacity:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 500
 *                 example: 30
 *               school:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439011
 *     responses:
 *       201:
 *         description: Classroom created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Validation error or classroom already exists
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Can only create classrooms in assigned school
 *       404:
 *         description: School not found
 */
router
  .route('/')
  .get(protect, getClassrooms)
  .post(
    protect,
    authorize('schooladmin'),
    [
      body('name')
        .trim()
        .notEmpty()
        .withMessage('Classroom name is required')
        .isLength({ max: 50 })
        .withMessage('Classroom name cannot exceed 50 characters'),
      body('capacity')
        .notEmpty()
        .withMessage('Capacity is required')
        .isInt({ min: 1, max: 500 })
        .withMessage('Capacity must be a number between 1 and 500'),
      body('school')
        .notEmpty()
        .withMessage('School is required')
        .isMongoId()
        .withMessage('Invalid school ID format')
    ],
    createClassroom
  );

/**
 * @swagger
 * /api/classrooms/{id}:
 *   get:
 *     summary: Get single classroom (Protected)
 *     description: Retrieve a single classroom by ID. School admin can only access classrooms in their school.
 *     tags: [Classrooms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Classroom ID
 *     responses:
 *       200:
 *         description: Classroom retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Not authorized to access this classroom
 *       404:
 *         description: Classroom not found
 *   put:
 *     summary: Update classroom (School admin only)
 *     description: Update classroom details in assigned school.
 *     tags: [Classrooms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Classroom ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 maxLength: 50
 *               capacity:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 500
 *     responses:
 *       200:
 *         description: Classroom updated successfully
 *       400:
 *         description: Validation error or classroom name exists
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Can only update classrooms in assigned school
 *       404:
 *         description: Classroom not found
 *   delete:
 *     summary: Delete classroom (School admin only)
 *     description: Delete a classroom from assigned school.
 *     tags: [Classrooms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Classroom ID
 *     responses:
 *       200:
 *         description: Classroom deleted successfully
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Can only delete classrooms in assigned school
 *       404:
 *         description: Classroom not found
 */
router
  .route('/:id')
  .get(protect, getClassroom)
  .put(
    protect,
    authorize('schooladmin'),
    [
      body('name')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Classroom name cannot be empty')
        .isLength({ max: 50 })
        .withMessage('Classroom name cannot exceed 50 characters'),
      body('capacity')
        .optional()
        .isInt({ min: 1, max: 500 })
        .withMessage('Capacity must be a number between 1 and 500')
    ],
    updateClassroom
  )
  .delete(protect, authorize('schooladmin'), deleteClassroom);

module.exports = router;

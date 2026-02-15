const express = require('express');
const { body } = require('express-validator');
const {
  createSchool,
  getSchools,
  getSchool,
  updateSchool,
  deleteSchool
} = require('../controllers/schoolController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * /api/schools:
 *   get:
 *     summary: Get all schools (Protected)
 *     description: Retrieve schools with pagination. Superadmin sees all schools, schooladmin sees only their assigned school.
 *     tags: [Schools]
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
 *         description: Schools retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginationResponse'
 *       401:
 *         description: Not authorized
 *       403:
 *         description: School admin must be assigned to a school
 *   post:
 *     summary: Create school (Superadmin only)
 *     description: Create a new school. Only superadmin can perform this action.
 *     tags: [Schools]
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
 *               - address
 *               - contactEmail
 *             properties:
 *               name:
 *                 type: string
 *                 maxLength: 100
 *                 example: Green Valley High School
 *               address:
 *                 type: string
 *                 maxLength: 200
 *                 example: 123 Main Street, New York, NY 10001
 *               contactEmail:
 *                 type: string
 *                 format: email
 *                 example: contact@greenvalley.edu
 *     responses:
 *       201:
 *         description: School created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Validation error or school already exists
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Only superadmin can create schools
 */
router
  .route('/')
  .get(protect, getSchools)
  .post(
    protect,
    authorize('superadmin'),
    [
      body('name')
        .trim()
        .notEmpty()
        .withMessage('School name is required')
        .isLength({ max: 100 })
        .withMessage('School name cannot exceed 100 characters'),
      body('address')
        .trim()
        .notEmpty()
        .withMessage('Address is required')
        .isLength({ max: 200 })
        .withMessage('Address cannot exceed 200 characters'),
      body('contactEmail')
        .trim()
        .notEmpty()
        .withMessage('Contact email is required')
        .isEmail()
        .withMessage('Please provide a valid email')
        .normalizeEmail()
    ],
    createSchool
  );

/**
 * @swagger
 * /api/schools/{id}:
 *   get:
 *     summary: Get single school (Protected)
 *     description: Retrieve a single school by ID. School admin can only access their assigned school.
 *     tags: [Schools]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: School ID
 *     responses:
 *       200:
 *         description: School retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Not authorized to access this school
 *       404:
 *         description: School not found
 *   put:
 *     summary: Update school (Superadmin only)
 *     description: Update school details. Only superadmin can perform this action.
 *     tags: [Schools]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: School ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 maxLength: 100
 *               address:
 *                 type: string
 *                 maxLength: 200
 *               contactEmail:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: School updated successfully
 *       400:
 *         description: Validation error or school name already exists
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Only superadmin can update schools
 *       404:
 *         description: School not found
 *   delete:
 *     summary: Delete school (Superadmin only)
 *     description: Delete a school. Only superadmin can perform this action.
 *     tags: [Schools]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: School ID
 *     responses:
 *       200:
 *         description: School deleted successfully
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Only superadmin can delete schools
 *       404:
 *         description: School not found
 */
router
  .route('/:id')
  .get(protect, getSchool)
  .put(
    protect,
    authorize('superadmin'),
    [
      body('name')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('School name cannot be empty')
        .isLength({ max: 100 })
        .withMessage('School name cannot exceed 100 characters'),
      body('address')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Address cannot be empty')
        .isLength({ max: 200 })
        .withMessage('Address cannot exceed 200 characters'),
      body('contactEmail')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Contact email cannot be empty')
        .isEmail()
        .withMessage('Please provide a valid email')
        .normalizeEmail()
    ],
    updateSchool
  )
  .delete(protect, authorize('superadmin'), deleteSchool);

module.exports = router;

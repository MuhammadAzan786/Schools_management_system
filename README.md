# School Management System API

A comprehensive REST API for managing schools, classrooms, and students with role-based access control.

## Features

- **Role-Based Access Control**: Superadmin and School Admin roles with different permissions
- **Authentication**: JWT-based authentication with secure password hashing
- **School Management**: Create and manage multiple schools
- **Classroom Management**: Organize classrooms within schools
- **Student Management**: Enroll students and manage transfers within schools
- **API Documentation**: Interactive Swagger/OpenAPI 3.0 documentation
- **Security**: Helmet, CORS, rate limiting, and MongoDB sanitization
- **Pagination**: Efficient data retrieval with pagination support
- **Validation**: Comprehensive input validation with express-validator

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **Documentation**: Swagger (swagger-jsdoc, swagger-ui-express)
- **Security**: Helmet, CORS, express-rate-limit, express-mongo-sanitize

## Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd school-management-api
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/school_management
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=30d
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

4. Start the server:
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

## API Documentation

Once the server is running, access the interactive API documentation at:

```
http://localhost:5000/api-docs
```

## Quick Start

### 1. Register a Superadmin

```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "password123",
  "role": "superadmin"
}
```

### 2. Login

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password123"
}
```

Copy the `token` from the response.

### 3. Create a School (Superadmin only)

```bash
POST /api/schools
Authorization: Bearer <your-token>
Content-Type: application/json

{
  "name": "Green Valley High School",
  "address": "123 Main Street",
  "contactEmail": "contact@greenvalley.edu"
}
```

### 4. Create a Classroom (School Admin)

```bash
POST /api/classrooms
Authorization: Bearer <your-token>
Content-Type: application/json

{
  "name": "Room 101",
  "capacity": 30,
  "school": "<school-id>"
}
```

### 5. Enroll a Student

```bash
POST /api/students
Authorization: Bearer <your-token>
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "age": 15,
  "classroom": "<classroom-id>",
  "school": "<school-id>"
}
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile

### Schools (Superadmin only for write operations)
- `GET /api/schools` - Get all schools (paginated)
- `GET /api/schools/:id` - Get school by ID
- `POST /api/schools` - Create a new school
- `PUT /api/schools/:id` - Update school
- `DELETE /api/schools/:id` - Delete school

### Classrooms
- `GET /api/classrooms` - Get all classrooms (paginated)
- `GET /api/classrooms/:id` - Get classroom by ID
- `POST /api/classrooms` - Create a new classroom
- `PUT /api/classrooms/:id` - Update classroom
- `DELETE /api/classrooms/:id` - Delete classroom

### Students
- `GET /api/students` - Get all students (paginated)
- `GET /api/students/:id` - Get student by ID
- `POST /api/students` - Enroll a new student
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student
- `POST /api/students/:id/transfer` - Transfer student to another classroom

## Project Structure

```
school-management-api/
├── config/
│   ├── config.js          # Environment configuration
│   ├── database.js        # MongoDB connection
│   └── swagger.js         # Swagger/OpenAPI configuration
├── controllers/
│   ├── authController.js
│   ├── schoolController.js
│   ├── classroomController.js
│   └── studentController.js
├── middleware/
│   ├── authMiddleware.js  # JWT authentication
│   ├── errorHandler.js    # Global error handler
│   └── notFound.js        # 404 handler
├── models/
│   ├── User.js
│   ├── School.js
│   ├── Classroom.js
│   └── Student.js
├── routes/
│   ├── authRoutes.js
│   ├── schoolRoutes.js
│   ├── classroomRoutes.js
│   └── studentRoutes.js
├── utils/
│   ├── asyncHandler.js    # Async error wrapper
│   ├── logger.js          # Logging utility
│   ├── pagination.js      # Pagination helpers
│   ├── response.js        # Response formatters
│   └── validation.js      # Validation helpers
├── app.js                 # Express app configuration
├── server.js              # Server entry point
└── package.json
```

## Access Control

### Superadmin
- Can create, update, and delete schools
- Can view all schools, classrooms, and students across the system
- Cannot be assigned to a specific school

### School Admin
- Must be assigned to a specific school
- Can manage classrooms within their assigned school only
- Can manage students within their assigned school only
- Can transfer students between classrooms within the same school
- Cannot perform cross-school operations

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | - |
| `JWT_SECRET` | JWT signing secret | - |
| `JWT_EXPIRE` | JWT expiration time | `30d` |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window (ms) | `900000` |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | `100` |

## License

ISC

## Author

Developed with Node.js, Express, and MongoDB

const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'School Management System API',
      version: '1.0.0',
      description: 'A comprehensive REST API for managing schools, classrooms, and students with role-based access control. Built with Node.js, Express, and MongoDB.',
      contact: {
        name: 'API Support',
        email: 'support@schoolmanagement.com'
      },
      license: {
        name: 'ISC',
        url: 'https://opensource.org/licenses/ISC'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token in the format: Bearer <token>'
        }
      },
      schemas: {
        User: {
          type: 'object',
          required: ['name', 'email', 'password', 'role'],
          properties: {
            _id: {
              type: 'string',
              description: 'User ID',
              example: '507f1f77bcf86cd799439011'
            },
            name: {
              type: 'string',
              description: 'User name',
              maxLength: 50,
              example: 'John Doe'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
              example: 'john@example.com'
            },
            role: {
              type: 'string',
              enum: ['superadmin', 'schooladmin'],
              description: 'User role',
              example: 'superadmin'
            },
            school: {
              type: 'string',
              description: 'School ID (required for schooladmin)',
              example: '507f1f77bcf86cd799439011'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Account creation timestamp'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp'
            }
          }
        },
        School: {
          type: 'object',
          required: ['name', 'address', 'contactEmail'],
          properties: {
            _id: {
              type: 'string',
              description: 'School ID',
              example: '507f1f77bcf86cd799439011'
            },
            name: {
              type: 'string',
              description: 'School name',
              maxLength: 100,
              example: 'Green Valley High School'
            },
            address: {
              type: 'string',
              description: 'School address',
              maxLength: 200,
              example: '123 Main Street, New York, NY 10001'
            },
            contactEmail: {
              type: 'string',
              format: 'email',
              description: 'School contact email',
              example: 'contact@greenvalley.edu'
            },
            createdBy: {
              type: 'string',
              description: 'Superadmin ID who created this school',
              example: '507f1f77bcf86cd799439012'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Classroom: {
          type: 'object',
          required: ['name', 'capacity', 'school'],
          properties: {
            _id: {
              type: 'string',
              description: 'Classroom ID',
              example: '507f1f77bcf86cd799439020'
            },
            name: {
              type: 'string',
              description: 'Classroom name',
              maxLength: 50,
              example: 'Room 101'
            },
            capacity: {
              type: 'integer',
              minimum: 1,
              maximum: 500,
              description: 'Classroom capacity',
              example: 30
            },
            school: {
              type: 'string',
              description: 'School ID',
              example: '507f1f77bcf86cd799439011'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Student: {
          type: 'object',
          required: ['firstName', 'lastName', 'age', 'classroom', 'school'],
          properties: {
            _id: {
              type: 'string',
              description: 'Student ID',
              example: '507f1f77bcf86cd799439030'
            },
            firstName: {
              type: 'string',
              description: 'Student first name',
              maxLength: 50,
              example: 'John'
            },
            lastName: {
              type: 'string',
              description: 'Student last name',
              maxLength: 50,
              example: 'Doe'
            },
            age: {
              type: 'integer',
              minimum: 3,
              maximum: 100,
              description: 'Student age',
              example: 15
            },
            classroom: {
              type: 'string',
              description: 'Classroom ID',
              example: '507f1f77bcf86cd799439020'
            },
            school: {
              type: 'string',
              description: 'School ID',
              example: '507f1f77bcf86cd799439011'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        AuthResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              example: 'User registered successfully'
            },
            data: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  example: '507f1f77bcf86cd799439011'
                },
                name: {
                  type: 'string',
                  example: 'John Doe'
                },
                email: {
                  type: 'string',
                  example: 'john@example.com'
                },
                role: {
                  type: 'string',
                  example: 'superadmin'
                },
                school: {
                  type: 'string',
                  nullable: true,
                  example: null
                },
                token: {
                  type: 'string',
                  example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
                }
              }
            }
          }
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              example: 'Operation successful'
            },
            data: {
              type: 'object'
            }
          }
        },
        PaginationResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              example: 'Resources retrieved successfully'
            },
            pagination: {
              type: 'object',
              properties: {
                currentPage: {
                  type: 'integer',
                  example: 1
                },
                totalPages: {
                  type: 'integer',
                  example: 5
                },
                totalItems: {
                  type: 'integer',
                  example: 50
                },
                itemsPerPage: {
                  type: 'integer',
                  example: 10
                },
                hasNextPage: {
                  type: 'boolean',
                  example: true
                },
                hasPrevPage: {
                  type: 'boolean',
                  example: false
                }
              }
            },
            data: {
              type: 'array',
              items: {
                type: 'object'
              }
            }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              example: 'Error message here'
            },
            stack: {
              type: 'string',
              description: 'Stack trace (development only)',
              example: 'Error: ...'
            }
          }
        }
      }
    },
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication endpoints'
      },
      {
        name: 'Schools',
        description: 'School management endpoints (Superadmin only for write operations)'
      },
      {
        name: 'Classrooms',
        description: 'Classroom management endpoints (School admin for write operations)'
      },
      {
        name: 'Students',
        description: 'Student management endpoints (School admin for write operations)'
      }
    ]
  },
  apis: ['./routes/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;

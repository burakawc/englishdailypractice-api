import swaggerJsdoc from 'swagger-jsdoc';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import path from 'path';

dotenv.config();

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'English Daily Practice API',
      version: '1.0.0',
      description: 'API Documentation for English Daily Practice Mobile App',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}`,
        description: 'Development server',
      },
    ],
    tags: [
      {
        name: 'Users',
        description: 'User management operations',
      },
      {
        name: 'Quizzes',
        description: 'Quiz operations',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            first_name: { type: 'string', example: 'John' },
            last_name: { type: 'string', example: 'Doe' },
            email: { type: 'string', example: 'john@example.com' },
            notification_token: { type: 'string', example: 'fcm-token-123' },
            notification_enabled: { type: 'boolean', example: true },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
          },
        },
        CreateUserRequest: {
          type: 'object',
          properties: {
            first_name: { type: 'string', example: 'John' },
            last_name: { type: 'string', example: 'Doe' },
            email: { type: 'string', example: 'john@example.com' },
            notification_token: { type: 'string', example: 'fcm-token-123' },
            notification_enabled: { type: 'boolean', example: true },
          },
        },
        UpdateUserRequest: {
          type: 'object',
          properties: {
            first_name: { type: 'string', example: 'John' },
            last_name: { type: 'string', example: 'Doe' },
            email: { type: 'string', example: 'john@example.com' },
            notification_token: { type: 'string', example: 'fcm-token-123' },
            notification_enabled: { type: 'boolean', example: true },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', example: 'john@example.com' },
            password: { type: 'string', example: 'password123' },
          },
        },
        LoginResponse: {
          type: 'object',
          properties: {
            token: {
              type: 'string',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            },
            user: {
              type: 'object',
              properties: {
                id: { type: 'integer', example: 1 },
                email: { type: 'string', example: 'john@example.com' },
                first_name: { type: 'string', example: 'John' },
                last_name: { type: 'string', example: 'Doe' },
                notification_enabled: { type: 'boolean', example: true },
              },
            },
          },
        },
        ChangePasswordRequest: {
          type: 'object',
          required: ['currentPassword', 'newPassword'],
          properties: {
            currentPassword: { type: 'string', example: '123456' },
            newPassword: { type: 'string', example: '654321' },
          },
        },
        CreateUserResponse: {
          type: 'object',
          properties: {
            user: {
              $ref: '#/components/schemas/User',
            },
            token: {
              type: 'string',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            },
          },
        },
        NotificationSetting: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            user_id: { type: 'integer' },
            time: { type: 'string', format: 'time' },
            days: {
              type: 'array',
              items: {
                type: 'string',
                enum: [
                  'Pazartesi',
                  'Salı',
                  'Çarşamba',
                  'Perşembe',
                  'Cuma',
                  'Cumartesi',
                  'Pazar',
                ],
              },
              description: 'Array of days',
              example: ['Çarşamba', 'Perşembe'],
            },
            tense: { type: 'string', enum: ['past', 'present', 'future'] },
            is_clicked: { type: 'boolean' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
          },
        },
        CreateNotificationRequest: {
          type: 'object',
          required: ['user_id', 'time', 'days', 'tense'],
          properties: {
            user_id: { type: 'integer' },
            time: { type: 'string', format: 'time' },
            days: {
              type: 'array',
              items: {
                type: 'string',
                enum: [
                  'Pazartesi',
                  'Salı',
                  'Çarşamba',
                  'Perşembe',
                  'Cuma',
                  'Cumartesi',
                  'Pazar',
                ],
              },
              example: ['Çarşamba', 'Perşembe'],
            },
            tense: { type: 'string', enum: ['past', 'present', 'future'] },
          },
        },
        QuizQuestion: {
          type: 'object',
          properties: {
            question_text: {
              type: 'string',
              example: 'What ___ you doing when I called?',
            },
            correct_answer: {
              type: 'string',
              example: 'were',
            },
            wrong_answers: {
              type: 'array',
              items: { type: 'string' },
              example: ['was', 'are', 'is'],
            },
          },
        },
        CreateQuizRequest: {
          type: 'object',
          required: ['tense', 'questionCount'],
          properties: {
            tense: {
              type: 'string',
              enum: [
                'simple_present',
                'present_continuous',
                'simple_past',
                'past_continuous',
                'simple_future',
                'future_continuous',
                'present_perfect',
                'present_perfect_continuous',
                'past_perfect',
                'past_perfect_continuous',
                'future_perfect',
                'future_perfect_continuous',
              ],
              example: 'past_continuous',
            },
            questionCount: {
              type: 'integer',
              minimum: 1,
              maximum: 20,
              default: 10,
              example: 10,
            },
          },
        },
        CreateQuizResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/QuizQuestion',
              },
            },
          },
        },
        QuizResult: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            user_id: { type: 'integer', example: 1 },
            tense: {
              type: 'string',
              enum: [
                'simple_present',
                'present_continuous',
                'simple_past',
                'past_continuous',
                'simple_future',
                'future_continuous',
                'present_perfect',
                'present_perfect_continuous',
                'past_perfect',
                'past_perfect_continuous',
                'future_perfect',
                'future_perfect_continuous',
              ],
              example: 'past_continuous',
            },
            total_questions: { type: 'integer', example: 10 },
            correct_answers: { type: 'integer', example: 7 },
            wrong_answers: { type: 'integer', example: 3 },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
          },
        },
        SaveQuizResultRequest: {
          type: 'object',
          required: [
            'tense',
            'total_questions',
            'correct_answers',
            'wrong_answers',
          ],
          properties: {
            tense: {
              type: 'string',
              enum: [
                'simple_present',
                'present_continuous',
                'simple_past',
                'past_continuous',
                'simple_future',
                'future_continuous',
                'present_perfect',
                'present_perfect_continuous',
                'past_perfect',
                'past_perfect_continuous',
                'future_perfect',
                'future_perfect_continuous',
              ],
              example: 'past_continuous',
            },
            total_questions: { type: 'integer', example: 10 },
            correct_answers: { type: 'integer', example: 7 },
            wrong_answers: { type: 'integer', example: 3 },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    paths: {
      '/api/notifications/user/{userId}': {
        get: {
          tags: ['Notifications'],
          summary: 'Get all notification settings for a user',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: 'path',
              name: 'userId',
              required: true,
              schema: { type: 'integer' },
            },
          ],
          responses: {
            '200': {
              description: 'List of notification settings',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      data: {
                        type: 'array',
                        items: {
                          $ref: '#/components/schemas/NotificationSetting',
                        },
                      },
                    },
                  },
                },
              },
            },
            '401': {
              description: 'Unauthorized - Invalid or missing token',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: false },
                      message: { type: 'string', example: 'Invalid token' },
                    },
                  },
                },
              },
            },
            '500': {
              description: 'Internal server error',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: false },
                      message: {
                        type: 'string',
                        example: 'Internal server error',
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      '/api/notifications': {
        post: {
          tags: ['Notifications'],
          summary: 'Create a new notification setting',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/CreateNotificationRequest',
                },
              },
            },
          },
          responses: {
            '201': {
              description: 'Notification setting created',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      data: {
                        $ref: '#/components/schemas/NotificationSetting',
                      },
                    },
                  },
                },
              },
            },
            '400': {
              description: 'Invalid request',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: false },
                      message: {
                        type: 'string',
                        example: 'Maksimum 5 bildirim oluşturulabilir.',
                      },
                    },
                  },
                },
              },
            },
            '401': {
              description: 'Unauthorized - Invalid or missing token',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: false },
                      message: { type: 'string', example: 'Invalid token' },
                    },
                  },
                },
              },
            },
            '500': {
              description: 'Internal server error',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: false },
                      message: {
                        type: 'string',
                        example: 'Internal server error',
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      '/api/notifications/{id}': {
        delete: {
          tags: ['Notifications'],
          summary: 'Delete a notification setting',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: 'path',
              name: 'id',
              required: true,
              schema: { type: 'integer' },
            },
          ],
          responses: {
            '204': {
              description: 'Notification setting deleted',
            },
            '404': {
              description: 'Notification setting not found',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: false },
                      message: {
                        type: 'string',
                        example: 'Notification setting not found',
                      },
                    },
                  },
                },
              },
            },
            '401': {
              description: 'Unauthorized - Invalid or missing token',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: false },
                      message: { type: 'string', example: 'Invalid token' },
                    },
                  },
                },
              },
            },
            '500': {
              description: 'Internal server error',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: false },
                      message: {
                        type: 'string',
                        example: 'Internal server error',
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      '/api/quiz/create': {
        post: {
          tags: ['Quizzes'],
          summary: 'Create a new quiz with random questions',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/CreateQuizRequest',
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Quiz created successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      data: {
                        type: 'object',
                        properties: {
                          questions: {
                            type: 'array',
                            items: {
                              $ref: '#/components/schemas/QuizQuestion',
                            },
                          },
                          quizId: { type: 'integer', example: 1 },
                        },
                      },
                    },
                  },
                },
              },
            },
            '400': {
              description: 'Invalid request',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: false },
                      message: {
                        type: 'string',
                        example: 'Invalid tense value',
                      },
                    },
                  },
                },
              },
            },
            '401': {
              description: 'Unauthorized - Invalid or missing token',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: false },
                      message: { type: 'string', example: 'Invalid token' },
                    },
                  },
                },
              },
            },
          },
        },
      },
      '/api/quiz-results': {
        post: {
          tags: ['Quizzes'],
          summary: 'Save quiz result for the authenticated user',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SaveQuizResultRequest',
                },
              },
            },
          },
          responses: {
            '201': {
              description: 'Quiz result saved successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      data: {
                        $ref: '#/components/schemas/QuizResult',
                      },
                    },
                  },
                },
              },
            },
            '400': {
              description: 'Invalid request',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: false },
                      message: {
                        type: 'string',
                        example: 'Invalid request data',
                      },
                    },
                  },
                },
              },
            },
            '401': {
              description: 'Unauthorized - Invalid or missing token',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: false },
                      message: {
                        type: 'string',
                        example: 'User not authenticated',
                      },
                    },
                  },
                },
              },
            },
            '500': {
              description: 'Internal server error',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: false },
                      message: {
                        type: 'string',
                        example: 'Internal server error',
                      },
                    },
                  },
                },
              },
            },
          },
        },
        get: {
          tags: ['Quizzes'],
          summary: "Get authenticated user's quiz results",
          security: [{ bearerAuth: [] }],
          responses: {
            '200': {
              description: 'List of quiz results',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      data: {
                        type: 'array',
                        items: {
                          $ref: '#/components/schemas/QuizResult',
                        },
                      },
                    },
                  },
                },
              },
            },
            '401': {
              description: 'Unauthorized - Invalid or missing token',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: false },
                      message: {
                        type: 'string',
                        example: 'User not authenticated',
                      },
                    },
                  },
                },
              },
            },
            '500': {
              description: 'Internal server error',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: false },
                      message: {
                        type: 'string',
                        example: 'Internal server error',
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: [path.join(__dirname, '../routes/*.ts')],
};

export const swaggerSpec = swaggerJsdoc(options);

// Swagger UI options
export const swaggerUiOptions = {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'English Daily Practice API Documentation',
  customfavIcon: '/favicon.ico',
  swaggerOptions: {
    persistAuthorization: true,
    docExpansion: 'none',
    filter: true,
    showExtensions: true,
    showCommonExtensions: true,
  },
};

// Swagger UI setup
export const setupSwagger = (app: any) => {
  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, swaggerUiOptions),
  );
};

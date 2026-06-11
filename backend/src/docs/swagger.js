const swaggerDocument = {
    openapi: '3.0.3',
    info: {
        title: 'Xact Marketing API',
        version: '1.0.0',
        description: 'API documentation for the Xact Marketing backend.',
    },
    servers: [
        {
            url: '/api/v1',
            description: 'Local development server',
        },
    ],
    tags: [
        {
            name: 'Auth',
            description: 'Authentication and account management endpoints',
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
            ApiSuccess: {
                type: 'object',
                properties: {
                    success: { type: 'boolean', example: true },
                    statusCode: { type: 'integer', example: 200 },
                    message: { type: 'string', example: 'Request successful' },
                    data: {},
                    timestamp: { type: 'string', format: 'date-time' },
                },
            },
            RegisterRequest: {
                type: 'object',
                required: ['name', 'email', 'password', 'confirmPassword'],
                properties: {
                    name: { type: 'string', example: 'Aman Sharma' },
                    email: { type: 'string', format: 'email', example: 'aman@example.com' },
                    password: { type: 'string', example: 'secret123' },
                    confirmPassword: { type: 'string', example: 'secret123' },
                    phone: { type: 'string', example: '+919999999999' },
                },
            },
            LoginRequest: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                    email: { type: 'string', format: 'email', example: 'aman@example.com' },
                    password: { type: 'string', example: 'secret123' },
                },
            },
            RefreshRequest: {
                type: 'object',
                properties: {
                    refreshToken: { type: 'string', example: 'optional-refresh-token' },
                },
            },
            ForgotPasswordRequest: {
                type: 'object',
                required: ['email'],
                properties: {
                    email: { type: 'string', format: 'email', example: 'aman@example.com' },
                },
            },
            ResetPasswordRequest: {
                type: 'object',
                required: ['token', 'password', 'confirmPassword'],
                properties: {
                    token: { type: 'string', example: 'reset-token-here' },
                    password: { type: 'string', example: 'newsecret123' },
                    confirmPassword: { type: 'string', example: 'newsecret123' },
                },
            },
            ChangePasswordRequest: {
                type: 'object',
                required: ['currentPassword', 'newPassword', 'confirmPassword'],
                properties: {
                    currentPassword: { type: 'string', example: 'oldsecret123' },
                    newPassword: { type: 'string', example: 'newsecret123' },
                    confirmPassword: { type: 'string', example: 'newsecret123' },
                },
            },
            OtpRequest: {
                type: 'object',
                required: ['userId', 'type'],
                properties: {
                    userId: { type: 'string', example: '66b1f8c2a1234567890abcde' },
                    type: {
                        type: 'string',
                        enum: ['EMAIL_VERIFICATION', 'PASSWORD_RESET', 'PHONE_VERIFICATION', 'TWO_FACTOR_AUTH'],
                        example: 'EMAIL_VERIFICATION',
                    },
                },
            },
            VerifyOtpRequest: {
                type: 'object',
                required: ['userId', 'type', 'otp'],
                properties: {
                    userId: { type: 'string', example: '66b1f8c2a1234567890abcde' },
                    type: {
                        type: 'string',
                        enum: ['EMAIL_VERIFICATION', 'PASSWORD_RESET', 'PHONE_VERIFICATION', 'TWO_FACTOR_AUTH'],
                        example: 'EMAIL_VERIFICATION',
                    },
                    otp: { type: 'string', example: '123456' },
                },
            },
        },
    },
    paths: {
        '/auth/register': {
            post: {
                tags: ['Auth'],
                summary: 'Register a new user',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/RegisterRequest' },
                        },
                    },
                },
                responses: {
                    201: {
                        description: 'OTP sent successfully',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ApiSuccess' },
                            },
                        },
                    },
                },
            },
        },
        '/auth/login': {
            post: {
                tags: ['Auth'],
                summary: 'Login user',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/LoginRequest' },
                        },
                    },
                },
                responses: {
                    200: {
                        description: 'Login successful',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ApiSuccess' },
                            },
                        },
                    },
                },
            },
        },
        '/auth/refresh': {
            post: {
                tags: ['Auth'],
                summary: 'Refresh access token',
                requestBody: {
                    required: false,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/RefreshRequest' },
                        },
                    },
                },
                responses: {
                    200: {
                        description: 'Token refreshed successfully',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ApiSuccess' },
                            },
                        },
                    },
                },
            },
        },
        '/auth/verify-email/{token}': {
            get: {
                tags: ['Auth'],
                summary: 'Verify email using token',
                parameters: [
                    {
                        name: 'token',
                        in: 'path',
                        required: true,
                        schema: { type: 'string' },
                    },
                ],
                responses: {
                    200: {
                        description: 'Email verified successfully',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ApiSuccess' },
                            },
                        },
                    },
                },
            },
        },
        '/auth/forgot-password': {
            post: {
                tags: ['Auth'],
                summary: 'Start password reset flow',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ForgotPasswordRequest' },
                        },
                    },
                },
                responses: {
                    200: {
                        description: 'Reset email sent if account exists',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ApiSuccess' },
                            },
                        },
                    },
                },
            },
        },
        '/auth/reset-password': {
            post: {
                tags: ['Auth'],
                summary: 'Reset password with token',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ResetPasswordRequest' },
                        },
                    },
                },
                responses: {
                    200: {
                        description: 'Password reset successfully',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ApiSuccess' },
                            },
                        },
                    },
                },
            },
        },
        '/auth/send-otp': {
            post: {
                tags: ['Auth'],
                summary: 'Send OTP to user',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/OtpRequest' },
                        },
                    },
                },
                responses: {
                    200: {
                        description: 'OTP sent successfully',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ApiSuccess' },
                            },
                        },
                    },
                },
            },
        },
        '/auth/verify-otp': {
            post: {
                tags: ['Auth'],
                summary: 'Verify OTP',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/VerifyOtpRequest' },
                        },
                    },
                },
                responses: {
                    200: {
                        description: 'OTP verified successfully',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ApiSuccess' },
                            },
                        },
                    },
                },
            },
        },
        '/auth/me': {
            get: {
                tags: ['Auth'],
                summary: 'Get current user profile',
                security: [{ bearerAuth: [] }],
                responses: {
                    200: {
                        description: 'Profile fetched successfully',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ApiSuccess' },
                            },
                        },
                    },
                },
            },
        },
        '/auth/change-password': {
            patch: {
                tags: ['Auth'],
                summary: 'Change current password',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ChangePasswordRequest' },
                        },
                    },
                },
                responses: {
                    200: {
                        description: 'Password changed successfully',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ApiSuccess' },
                            },
                        },
                    },
                },
            },
        },
        '/auth/logout': {
            post: {
                tags: ['Auth'],
                summary: 'Logout current user',
                security: [{ bearerAuth: [] }],
                responses: {
                    200: {
                        description: 'Logged out successfully',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ApiSuccess' },
                            },
                        },
                    },
                },
            },
        },
    },
};

export default swaggerDocument;

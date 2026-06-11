import Joi from 'joi';

const otpTypes = ['EMAIL_VERIFICATION', 'PASSWORD_RESET', 'PHONE_VERIFICATION', 'TWO_FACTOR_AUTH'];

const registerSchema = Joi.object({
    name: Joi.string().min(2).max(50).required().messages({
        'string.min': 'Name must be at least 2 characters',
        'any.required': 'Name is required',
    }),
    email: Joi.string().email().required().messages({
        'string.email': 'Please provide a valid email',
        'any.required': 'Email is required',
    }),
    password: Joi.string().min(6).required().messages({
        'string.min': 'Password must be at least 6 characters',
        'any.required': 'Password is required',
    }),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
        'any.only': 'Passwords do not match',
        'any.required': 'Please confirm your password',
    }),
    phone: Joi.string().optional().allow(''),
});

const loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Please provide a valid email',
        'any.required': 'Email is required',
    }),
    password: Joi.string().required().messages({
        'any.required': 'Password is required',
    }),
});

const refreshSchema = Joi.object({
    refreshToken: Joi.string().optional(),
});

const forgotPasswordSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Please provide a valid email',
        'any.required': 'Email is required',
    }),
});

const resetPasswordSchema = Joi.object({
    token: Joi.string().required(),
    password: Joi.string().min(6).required().messages({
        'string.min': 'Password must be at least 6 characters',
        'any.required': 'Password is required',
    }),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
        'any.only': 'Passwords do not match',
    }),
});

const changePasswordSchema = Joi.object({
    currentPassword: Joi.string().required().messages({
        'any.required': 'Current password is required',
    }),
    newPassword: Joi.string().min(6).required().messages({
        'string.min': 'Password must be at least 6 characters',
        'any.required': 'New password is required',
    }),
    confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required().messages({
        'any.only': 'Passwords do not match',
    }),
});

const sendOtpSchema = Joi.object({
    userId: Joi.string().required().messages({
        'any.required': 'User ID is required',
    }),
    type: Joi.string().valid(...otpTypes).required().messages({
        'any.only': 'Invalid OTP type',
        'any.required': 'OTP type is required',
    }),
});

const verifyOtpSchema = Joi.object({
    userId: Joi.string().required().messages({
        'any.required': 'User ID is required',
    }),
    type: Joi.string().valid(...otpTypes).required().messages({
        'any.only': 'Invalid OTP type',
        'any.required': 'OTP type is required',
    }),
    otp: Joi.string().length(6).required().messages({
        'string.length': 'OTP must be 6 digits',
        'any.required': 'OTP is required',
    }),
});

export {
    registerSchema,
    loginSchema,
    refreshSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    changePasswordSchema,
    sendOtpSchema,
    verifyOtpSchema,
};

import asyncHandler from '../../common/asyncHandler.js';
import AppError from '../../common/AppError.js';
import { sendSuccess } from '../../common/response.js';
import {
    OTP_TYPES,
    REFRESH_COOKIE_NAME,
    getRefreshCookieOptions,
    getClearRefreshCookieOptions,
    login as loginService,
    logout as logoutService,
    register as registerService,
    refreshAccessToken as refreshAccessTokenService,
    forgotPassword as forgotPasswordService,
    resetPassword as resetPasswordService,
    changePassword as changePasswordService,
    getMe as getMeService,
    verifyEmail as verifyEmailService,
    sendOtp as sendOtpService,
    verifyOtp as verifyOtpService,
    createSession,
    generateAccessToken,
    generateRefreshToken,
} from './auth.services.js';
import { User } from './auth.modals.js';

const getRequestContext = (req) => ({
    ip: req.ip || req.socket?.remoteAddress || 'unknown',
    userAgent: req.headers['user-agent'] || 'unknown',
});

const setRefreshTokenCookie = (res, refreshToken) => {
    res.cookie(REFRESH_COOKIE_NAME, refreshToken, getRefreshCookieOptions());
};

// POST /auth/register
const register = asyncHandler(async (req, res) => {
    const { name, email, password, phone } = req.body;
    const user = await registerService({ name, email, password, phone });

    await sendOtpService({
        user,
        type: OTP_TYPES.EMAIL_VERIFICATION,
    });

    sendSuccess(res, {
        statusCode: 201,
        message: 'OTP sent successfully. Please verify your email.',
        data: { user: user },
    });
});

// POST /auth/login
const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const result = await loginService({
        email,
        password,
        ...getRequestContext(req),
    });

    setRefreshTokenCookie(res, result.refreshToken);

    sendSuccess(res, {
        message: 'Login successful',
        data: {
            accessToken: result.accessToken,
            user: result.user,
        },
    });
});

// POST /auth/refresh
const refresh = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
    // console.log('refresh token: ', refreshToken);
    const result = await refreshAccessTokenService(refreshToken, getRequestContext(req));

    setRefreshTokenCookie(res, result.refreshToken);

    sendSuccess(res, {
        message: 'Token refreshed successfully',
        data: { accessToken: result.accessToken },
    });
});

// POST /auth/logout
const logout = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
    const userId = req.user?.id;

    await logoutService({ userId, refreshToken });
    res.clearCookie(REFRESH_COOKIE_NAME, getClearRefreshCookieOptions());
    sendSuccess(res, { message: 'Logged out successfully', data: null });
});

// GET /auth/me
const getMe = asyncHandler(async (req, res) => {
    const user = await getMeService(req.user.id);
    sendSuccess(res, { message: 'Profile fetched successfully', data: user });
});

// GET /auth/verify-email/:token
const verifyEmail = asyncHandler(async (req, res) => {
    const result = await verifyEmailService(req.params.token);
    sendSuccess(res, { message: 'Email verified successfully', data: result });
});

// POST /auth/forgot-password
const forgotPassword = asyncHandler(async (req, res) => {
    await forgotPasswordService(req.body.email);
    sendSuccess(res, {
        message: 'If this email exists, a reset link has been sent.',
        data: null,
    });
});

// POST /auth/reset-password
const resetPassword = asyncHandler(async (req, res) => {
    const result = await resetPasswordService(req.body);
    sendSuccess(res, { message: 'Password reset successfully', data: result });
});

// PATCH /auth/change-password
const changePassword = asyncHandler(async (req, res) => {
    await changePasswordService(req.user.id, req.body);
    sendSuccess(res, { message: 'Password changed successfully', data: null });
});

// POST /auth/send-otp
const sendOtp = asyncHandler(async (req, res) => {
    const { userId, type } = req.body;
    const user = await User.findById(userId);

    if (!user) {
        throw new AppError('User not found', 404);
    }

    const result = await sendOtpService({ user, type });

    sendSuccess(res, {
        message: 'OTP sent successfully',
        data: result,
    });
});

// POST /auth/verify-otp
const verifyOtp = asyncHandler(async (req, res) => {
    const { userId, type, otp } = req.body;
    const user = await User.findById(userId);

    if (!user) {
        throw new AppError('User not found', 404);
    }

    await verifyOtpService({ userId, type, otp });

    if (type === OTP_TYPES.EMAIL_VERIFICATION) {
        user.isEmailVerified = true;
        user.emailVerifiedAt = new Date();
        await user.save({ validateBeforeSave: false });

        const tokenPayload = { id: user._id, email: user.email, role: user.role };
        const accessToken = generateAccessToken(tokenPayload);
        const refreshToken = generateRefreshToken(tokenPayload);

        await createSession({
            userId: user._id,
            refreshToken,
            ...getRequestContext(req),
        });

        setRefreshTokenCookie(res, refreshToken);

        return sendSuccess(res, {
            message: 'OTP verified successfully',
            data: {
                verified: true,
                type: type,
                accessToken: accessToken,
                user: user
            },
        });
    }

    if (type === OTP_TYPES.PHONE_VERIFICATION) {
        user.isPhoneVerified = true;
        user.phoneVerifiedAt = new Date();
        await user.save({ validateBeforeSave: false });

        return sendSuccess(res, {
            message: 'OTP verified successfully',
            data: {
                verified: true,
                type,
            },
        });
    }

    return sendSuccess(res, {
        message: 'OTP verified successfully',
        data: {
            verified: true,
            type,
        },
    });
});

export {
    register,
    login,
    refresh,
    logout,
    getMe,
    verifyEmail,
    forgotPassword,
    resetPassword,
    changePassword,
    sendOtp,
    verifyOtp,
};

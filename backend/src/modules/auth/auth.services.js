import jwt from 'jsonwebtoken';
import AppError from '../../common/AppError.js';
import { sendEmail } from '../../shared/mail.js';
import { generateAccessToken, generateOtp, generateRandomToken, generateRefreshToken } from '../../utils/generators.utils.js';
import {
    OTP_TYPES,
    OTP_EXPIRY_MINUTES,
    OTP_MAX_ATTEMPTS,
    REFRESH_COOKIE_NAME,
    getClearRefreshCookieOptions,
    getEmailContent,
    getRefreshCookieOptions,
    hashOtp,
    hashToken,
    sanitizeUser,
} from '../../utils/helpers.utils.js';
import { Otp, Session, User } from './auth.modals.js';

const createSession = async ({ userId, refreshToken, ip, userAgent }) => {
    return Session.create({
        userId,
        refreshTokenHash: hashToken(refreshToken),
        ip,
        userAgent,
    });
};

const sendPhoneOtp = async ({ user, otp }) => {
    if (!user.phone) {
        throw new AppError('Phone number is required for phone verification', 400);
    }

    if (process.env.NODE_ENV !== 'production') {
        console.log(`[OTP][PHONE_VERIFICATION] ${user.phone}: ${otp}`);
        return;
    }

    throw new AppError('SMS delivery is not configured yet', 501);
};

const createOtp = async ({ userId, type, otp }) => {
    await Otp.deleteMany({
        userId,
        type,
        used: false,
    });

    return Otp.create({
        userId,
        type,
        otpHash: hashOtp(otp),
        expiresAt: new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000),
    });
};

const sendOtp = async ({ user, type }) => {
    if (!user?._id) {
        throw new AppError('User is required to send OTP', 400);
    }

    if (!Object.values(OTP_TYPES).includes(type)) {
        throw new AppError('Invalid OTP type', 400);
    }

    const { otp, otpExpiry, formattedExpiry } = generateOtp(OTP_EXPIRY_MINUTES);
    await createOtp({ userId: user._id, type, otp });

    if (type === OTP_TYPES.PHONE_VERIFICATION) {
        await sendPhoneOtp({ user, otp });
        return {
            expiresAt: otpExpiry,
            expiryLabel: formattedExpiry,
            delivery: 'sms',
        };
    }

    const emailPayload = getEmailContent({ type, user, otp });
    if (!emailPayload) {
        throw new AppError('OTP delivery is not configured for this type', 501);
    }

    await sendEmail({
        to: user.email,
        subject: emailPayload.subject,
        html: emailPayload.html,
    });

    return {
        expiresAt: otpExpiry,
        expiryLabel: formattedExpiry,
        delivery: 'email',
    };
};

const verifyOtp = async ({ userId, type, otp }) => {
    if (!userId || !type || !otp) {
        throw new AppError('User, type and OTP are required', 400);
    }

    if (!Object.values(OTP_TYPES).includes(type)) {
        throw new AppError('Invalid OTP type', 400);
    }

    const otpData = await Otp.findOne({
        userId,
        type,
        used: false,
        expiresAt: { $gt: new Date() },
    })
        .sort({ createdAt: -1 })
        .select('+otpHash');

    if (!otpData) {
        throw new AppError('Invalid or expired OTP', 400);
    }

    const incomingHash = hashOtp(otp);
    if (incomingHash !== otpData.otpHash) {
        otpData.attempts += 1;

        if (otpData.attempts >= OTP_MAX_ATTEMPTS) {
            otpData.used = true;
        }

        await otpData.save();
        throw new AppError('Invalid OTP', 400);
    }

    otpData.used = true;
    otpData.attempts += 1;
    await otpData.save();

    return otpData;
};

const revokeSessionByRefreshToken = async (refreshToken) => {
    if (!refreshToken) {
        return null;
    }

    return Session.findOneAndUpdate(
        {
            refreshTokenHash: hashToken(refreshToken),
            revoked: false,
        },
        {
            $set: {
                revoked: true,
                logoutAt: new Date(),
            },
        },
        {
            new: true,
        }
    );
};

const revokeAllSessionsForUser = async (userId) => {
    if (!userId) {
        return;
    }

    await Session.updateMany(
        {
            userId,
            revoked: false,
        },
        {
            $set: {
                revoked: true,
                logoutAt: new Date(),
            },
        }
    );
};

const register = async ({ name, email, password, phone }) => {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new AppError('Email already registered', 409);
    }

    const user = await User.create({
        name,
        email,
        password,
        phone,
    });

    return sanitizeUser(user);
};

const login = async ({ email, password, ip = 'unknown', userAgent = 'unknown' }) => {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
        throw new AppError('Invalid email or password', 401);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        throw new AppError('Invalid email or password', 401);
    }

    if (user.status === 'BANNED') {
        throw new AppError('Your account has been banned', 403);
    }

    if (user.status === 'INACTIVE') {
        throw new AppError('Your account is inactive', 403);
    }

    const tokenPayload = {
        id: user._id,
        email: user.email,
        role: user.role,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    await createSession({
        userId: user._id,
        refreshToken,
        ip,
        userAgent,
    });

    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    return {
        accessToken,
        refreshToken,
        user: sanitizeUser(user),
    };
};

const refreshAccessToken = async (refreshToken, { ip = 'unknown', userAgent = 'unknown' } = {}) => {
    if (!refreshToken) {
        throw new AppError('Refresh token is required', 401);
    }

    let decoded;
    try {
        decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch {
        throw new AppError('Invalid or expired refresh token', 401);
    }

    const session = await Session.findOne({
        userId: decoded.id,
        refreshTokenHash: hashToken(refreshToken),
        revoked: false,
    });

    if (!session) {
        throw new AppError('Refresh token is invalid or revoked', 401);
    }

    const user = await User.findById(decoded.id);
    if (!user || user.status === 'BANNED' || user.status === 'INACTIVE') {
        throw new AppError('User not available', 403);
    }

    const tokenPayload = {
        id: user._id,
        email: user.email,
        role: user.role,
    };

    const newAccessToken = generateAccessToken(tokenPayload);
    const newRefreshToken = generateRefreshToken(tokenPayload);

    session.refreshTokenHash = hashToken(newRefreshToken);
    session.ip = ip;
    session.userAgent = userAgent;
    await session.save();

    return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
    };
};

const logout = async ({ userId, refreshToken } = {}) => {
    if (refreshToken) {
        const revokedSession = await revokeSessionByRefreshToken(refreshToken);
        if (revokedSession) {
            return revokedSession;
        }
    }

    await revokeAllSessionsForUser(userId);
    return null;
};

const getMe = async (userId) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new AppError('User not found', 404);
    }

    return sanitizeUser(user);
};

const verifyEmail = async (token) => {
    const user = await User.findOne({
        emailVerifyToken: token,
        emailVerifyExpiry: { $gt: Date.now() },
    }).select('+emailVerifyToken +emailVerifyExpiry');

    if (!user) {
        throw new AppError('Invalid or expired verification token', 400);
    }

    user.isEmailVerified = true;
    user.emailVerifyToken = null;
    user.emailVerifyExpiry = null;
    await user.save({ validateBeforeSave: false });

    return { email: user.email };
};

const forgotPassword = async (email) => {
    const user = await User.findOne({ email });
    if (!user) {
        return;
    }

    const resetToken = generateRandomToken();
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiry = new Date(Date.now() + 60 * 60 * 1000);
    await user.save({ validateBeforeSave: false });

    const resetUrl = process.env.FRONTEND_RESET_PASSWORD_URL
        ? `${process.env.FRONTEND_RESET_PASSWORD_URL}?token=${resetToken}`
        : resetToken;

    await sendEmail({
        to: user.email,
        subject: 'Reset your password',
        html: `
            <p>Hello <strong>${user.name}</strong>,</p>
            <p>Use the link below to reset your password:</p>
            <p><a href="${resetUrl}">${resetUrl}</a></p>
            <p>This link expires in 1 hour.</p>
        `,
    });
};

const resetPassword = async ({ token, password }) => {
    const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpiry: { $gt: Date.now() },
    }).select('+resetPasswordToken +resetPasswordExpiry');

    if (!user) {
        throw new AppError('Invalid or expired reset token', 400);
    }

    user.password = password;
    user.resetPasswordToken = null;
    user.resetPasswordExpiry = null;
    await user.save();

    await revokeAllSessionsForUser(user._id);

    return { email: user.email };
};

const changePassword = async (userId, { currentPassword, newPassword }) => {
    const user = await User.findById(userId).select('+password');
    if (!user) {
        throw new AppError('User not found', 404);
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
        throw new AppError('Current password is incorrect', 400);
    }

    user.password = newPassword;
    await user.save();

    await revokeAllSessionsForUser(userId);
};

const authServices = {
    OTP_TYPES,
    OTP_EXPIRY_MINUTES,
    OTP_MAX_ATTEMPTS,
    REFRESH_COOKIE_NAME,
    getRefreshCookieOptions,
    getClearRefreshCookieOptions,
    generateAccessToken,
    generateRefreshToken,
    generateRandomToken,
    createSession,
    register,
    login,
    refreshAccessToken,
    logout,
    getMe,
    verifyEmail,
    forgotPassword,
    resetPassword,
    changePassword,
    sendOtp,
    verifyOtp,
};

export {
    OTP_TYPES,
    OTP_EXPIRY_MINUTES,
    OTP_MAX_ATTEMPTS,
    REFRESH_COOKIE_NAME,
    getRefreshCookieOptions,
    getClearRefreshCookieOptions,
    generateAccessToken,
    generateRefreshToken,
    generateRandomToken,
    createSession,
    register,
    login,
    refreshAccessToken,
    logout,
    getMe,
    verifyEmail,
    forgotPassword,
    resetPassword,
    changePassword,
    sendOtp,
    verifyOtp,
};

export default authServices;

import { hashItem } from './generators.utils.js';
import emailVerificationTemplate from '../templates/auth/emailVerification.template.js';
import passwordResetTemplate from '../templates/auth/passwordReset.template.js';
import twoFactorTemplate from '../templates/auth/twoFactor.template.js';

export const OTP_TYPES = {
    EMAIL_VERIFICATION: 'EMAIL_VERIFICATION',
    PASSWORD_RESET: 'PASSWORD_RESET',
    PHONE_VERIFICATION: 'PHONE_VERIFICATION',
    TWO_FACTOR_AUTH: 'TWO_FACTOR_AUTH',
};

export const OTP_EXPIRY_MINUTES = 10;
export const OTP_MAX_ATTEMPTS = 5;
export const REFRESH_COOKIE_NAME = 'refreshToken';
export const REFRESH_COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

export const getRefreshCookieOptions = () => ({
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: REFRESH_COOKIE_MAX_AGE,
});

export const getClearRefreshCookieOptions = () => ({
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
});

export const hashToken = (token) => hashItem(token);
export const hashOtp = (otp) => hashItem(otp);

export const sanitizeUser = (user) => ({
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    status: user.status,
    avatar: user.avatar,
    isEmailVerified: user.isEmailVerified,
    isPhoneVerified: user.isPhoneVerified,
    lastLogin: user.lastLogin,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
});

export const getEmailContent = ({ type, user, otp }) => {
    switch (type) {
        case OTP_TYPES.EMAIL_VERIFICATION:
            return {
                subject: 'Verify your email address',
                html: emailVerificationTemplate({
                    name: user.name,
                    otp,
                    expiryMinutes: OTP_EXPIRY_MINUTES,
                }),
            };
        case OTP_TYPES.PASSWORD_RESET:
            return {
                subject: 'Reset your password',
                html: passwordResetTemplate({
                    name: user.name,
                    otp,
                    expiryMinutes: OTP_EXPIRY_MINUTES,
                }),
            };
        case OTP_TYPES.TWO_FACTOR_AUTH:
            return {
                subject: 'Two-factor authentication code',
                html: twoFactorTemplate({
                    name: user.name,
                    otp,
                }),
            };
        default:
            return null;
    }
};

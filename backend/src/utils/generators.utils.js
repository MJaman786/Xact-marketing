import crypto from 'crypto';
import jwt from 'jsonwebtoken';

export const generateAccessToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    });
};

export const generateRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    });
};

export const generateRandomToken = () => {
    return crypto.randomBytes(32).toString('hex');
};

export const generateOtp = (expiryMinutes = 10) => {
    const otpExpiry = new Date(Date.now() + expiryMinutes * 60 * 1000);
    const formattedExpiry = otpExpiry.toLocaleString('en-IN', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    });

    return {
        otpExpiry,
        formattedExpiry,
        otp: crypto.randomInt(100000, 999999).toString(),
    };
};

export const hashItem = (item) =>
    crypto.createHash('sha256').update(String(item)).digest('hex');

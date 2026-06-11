import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
        },
        phone: {
            type: String,
            default: null,
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: 6,
            select: false,
        },
        role: {
            type: String,
            enum: ['USER', 'ADMIN', 'SUPER_ADMIN'],
            default: 'USER',
        },
        status: {
            type: String,
            enum: ['ACTIVE', 'INACTIVE', 'BANNED'],
            default: 'ACTIVE',
        },
        avatar: {
            type: String,
            default: null,
        },
        isEmailVerified: {
            type: Boolean,
            default: false,
        },
        emailVerifiedAt: {
            type: Date,
            default: null,
        },
        isPhoneVerified: {
            type: Boolean,
            default: false,
        },
        phoneVerifiedAt: {
            type: Date,
            default: null,
        },
        emailVerifyToken: {
            type: String,
            default: null,
            select: false,
        },
        emailVerifyExpiry: {
            type: Date,
            default: null,
            select: false,
        },
        resetPasswordToken: {
            type: String,
            default: null,
            select: false,
        },
        resetPasswordExpiry: {
            type: Date,
            default: null,
            select: false,
        },
        lastLogin: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true }
);

userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = async function (clientPassword) {
    return bcrypt.compare(clientPassword, this.password);
};

const User = mongoose.model('User', userSchema, 'Users');

const otpSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'User ID is required'],
            index: true,
        },
        type: {
            type: String,
            enum: [
                'EMAIL_VERIFICATION',
                'PASSWORD_RESET',
                'PHONE_VERIFICATION',
                'TWO_FACTOR_AUTH',
            ],
            required: [true, 'OTP type is required'],
            index: true,
        },
        otpHash: {
            type: String,
            required: [true, 'OTP hash is required'],
            select: false,
        },
        attempts: {
            type: Number,
            default: 0,
            min: 0,
        },
        used: {
            type: Boolean,
            default: false,
        },
        expiresAt: {
            type: Date,
            required: [true, 'Expiry date is required'],
            index: {
                expires: 0,
            },
        },
    },
    { timestamps: true }
);

otpSchema.index({ userId: 1, type: 1 });
otpSchema.index(
    { userId: 1, type: 1, used: 1 },
    {
        partialFilterExpression: {
            used: false,
        },
    }
);

const Otp = mongoose.model('Otp', otpSchema, 'Otps');

const sessionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'User is required'],
            index: true,
        },
        refreshTokenHash: {
            type: String,
            required: [true, 'Refresh token hash is required'],
            index: true,
        },
        ip: {
            type: String,
            required: [true, 'IP is required'],
        },
        userAgent: {
            type: String,
            required: [true, 'User agent is required'],
        },
        revoked: {
            type: Boolean,
            default: false,
            index: true,
        },
        loginAt: {
            type: Date,
            default: Date.now,
        },
        logoutAt: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true }
);

sessionSchema.index({ userId: 1, revoked: 1 });

const Session = mongoose.model('Session', sessionSchema, 'Sessions');

export { User, Otp, Session };

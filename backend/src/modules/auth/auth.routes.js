import { Router } from 'express';
import validate from '../../middlewares/validate.middleware.js';
import protect from '../../middlewares/auth.middleware.js';
import {
    registerSchema,
    loginSchema,
    refreshSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    changePasswordSchema,
    sendOtpSchema,
    verifyOtpSchema,
} from './auth.validations.js';
import * as ctrl from './auth.controllers.js';

const router = Router();

router.post('/register', validate(registerSchema), ctrl.register);
router.post('/login', validate(loginSchema), ctrl.login);
router.post('/refresh', validate(refreshSchema), ctrl.refresh);
router.get('/verify-email/:token', ctrl.verifyEmail);
router.post('/forgot-password', validate(forgotPasswordSchema), ctrl.forgotPassword);
router.post('/reset-password', validate(resetPasswordSchema), ctrl.resetPassword);
router.post('/send-otp', validate(sendOtpSchema), ctrl.sendOtp);
router.post('/verify-otp', validate(verifyOtpSchema), ctrl.verifyOtp);

router.get('/me', protect, ctrl.getMe);
router.patch('/change-password', protect, validate(changePasswordSchema), ctrl.changePassword);
router.post('/logout', protect, ctrl.logout);

export default router;

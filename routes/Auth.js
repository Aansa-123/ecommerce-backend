import express from 'express';
import * as authController from '../controllers/Auth.js';
import { verifyToken } from '../middleware/VerifyToken.js';

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/verify-otp', authController.verifyOtp);
router.post('/resend-otp', authController.resendOtp);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.get('/check-auth', verifyToken, authController.checkAuth);
router.get('/logout', authController.logout);

export default router;

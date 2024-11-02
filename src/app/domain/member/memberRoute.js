import express from 'express';
import { MemberController } from './memberController.js';
import { authMiddleware } from '../../global/authMiddleware.js';

const router = express.Router();
const controller = new MemberController();

router.post('/signup', controller.signup);
router.post('/login', controller.login);
router.put('/profile', authMiddleware, controller.updateProfile);
router.post('/refresh', controller.refreshToken);

export default router;

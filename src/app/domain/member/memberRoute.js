import express from 'express';
import { KakaoAuthController } from '../auth/controller/kakaoAuthController.js';
import { MemberController } from './memberController.js';
import { authMiddleware } from '../auth/middleware/authMiddleware.js';

const router = express.Router();
const kakaoController = new KakaoAuthController();
const memberController = new MemberController();

router.get('/social/kakao', kakaoController.kakaoLogin);
router.get('/social/kakao/callback', kakaoController.kakaoCallback);
router.get('/profile', authMiddleware, memberController.getProfile);
router.post(
  '/connect/request',
  authMiddleware,
  memberController.requestConnection
);
router.post(
  '/connect/verify',
  authMiddleware,
  memberController.verifyConnection
);
router.post('/logout', authMiddleware, memberController.logout);
router.delete('/withdraw', authMiddleware, memberController.withdraw);

export default router;

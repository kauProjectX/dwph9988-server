import jwt from 'jsonwebtoken';
import { UnauthorizedError } from './errorHandler.js';
import { MemberRepository } from '../domain/member/memberRepository.js';

const memberRepository = new MemberRepository();

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedError('인증 토큰이 없습니다.');
    }

    const token = authHeader.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : authHeader;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded Token:', decoded);

    const user = await memberRepository.findById(BigInt(decoded.userId));
    if (!user) {
      throw new UnauthorizedError('존재하지 않는 사용자입니다.');
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth Error:', error);
    if (error instanceof jwt.JsonWebTokenError) {
      next(new UnauthorizedError('유효하지 않은 인증 토큰입니다.'));
    } else {
      next(error);
    }
  }
};

import jwt from 'jsonwebtoken';
import { AUTH_CONFIG } from '../auth/config/authConfig.js';
import { MemberRepository } from './memberRepository.js';
import { NotFoundError, BadRequestError } from '../../global/errorHandler.js';
import axios from 'axios';

export class MemberService {
  constructor() {
    this.memberRepository = new MemberRepository();
  }

  async kakaoLogin(kakaoData) {
    const { kakaoId, email, nickname } = kakaoData;

    let user = await this.memberRepository.findByKakaoId(kakaoId);

    if (!user) {
      user = await this.memberRepository.create({
        kakaoId,
        userName: nickname,
        userType: 'GUARDIAN',
        email: email || null,
      });
    }

    const accessToken = this.generateAccessToken(user.id);

    return {
      accessToken,
      user: {
        id: Number(user.id),
        userName: user.userName,
        userType: user.userType,
      },
    };
  }

  generateAccessToken(userId) {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error('JWT_SECRET:', process.env.JWT_SECRET);
      throw new Error('JWT secret is not configured');
    }

    return jwt.sign({ userId: userId.toString() }, secret, {
      expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '24h',
    });
  }

  async getProfile(userId) {
    console.log('Fetching profile for userId:', userId);
    const user = await this.memberRepository.findById(userId);
    console.log('Found user:', user);

    if (!user) {
      throw new NotFoundError('사용자를 찾을 수 없습니다.');
    }
    return user;
  }

  async requestConnection(guardianId, phoneNumber) {
    const verificationCode = Math.random().toString().slice(2, 8);

    const protect = await this.memberRepository.createProtect({
      guardianId,
      phoneNumber,
      verificationCode,
      status: 'PENDING',
      requestType: 'DIRECT',
      codeExpiredAt: new Date(Date.now() + 30 * 60 * 1000),
    });

    console.log('========= 인증번호 발송 시뮬레이션 =========');
    console.log('수신번호:', phoneNumber);
    console.log('인증번호:', verificationCode);
    console.log('====================================');

    return {
      protectId: protect.id,
      verificationCode,
      expiresIn: '30분',
    };
  }

  async verifyConnection(guardianId, protectId, verificationCode) {
    const protect = await this.memberRepository.findProtectById(protectId);

    if (!protect || protect.guardianId !== guardianId) {
      throw new BadRequestError('유효하지 않은 요청입니다.');
    }

    if (protect.status !== 'PENDING') {
      throw new BadRequestError('이미 처리된 요청입니다.');
    }

    if (protect.codeExpiredAt < new Date()) {
      throw new BadRequestError('인증번호가 만료되었습니다.');
    }

    if (protect.verificationCode !== verificationCode) {
      throw new BadRequestError('인증번호가 일치하지 않습니다.');
    }

    await this.memberRepository.updateProtect(protectId, {
      status: 'ACTIVE',
      verifiedAt: new Date(),
    });

    return true;
  }

  async logout(userId, accessToken) {
    const user = await this.memberRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('사용자를 찾을 수 없습니다.');
    }

    // 카카오 로그아웃
    try {
      await axios.post(
        'https://kapi.kakao.com/v1/user/logout',
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
    } catch (error) {
      console.error(
        'Kakao logout error:',
        error.response?.data || error.message
      );
      // 카카오 로그아웃 실패해도 계속 진행
    }

    // 클라이언트에서 토큰을 삭제하도록 안내
    return true;
  }

  async withdraw(userId, accessToken) {
    const user = await this.memberRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('사용자를 찾을 수 없습니다.');
    }

    try {
      // 1. 카카오 연동 해제 (Admin Key 사용)
      await axios.post(
        'https://kapi.kakao.com/v1/user/unlink',
        {
          target_id_type: 'user_id',
          target_id: user.kakaoId,
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `KakaoAK ${process.env.KAKAO_ADMIN_KEY}`,
          },
        }
      );

      // 2. DB에서 사용자 삭제
      await this.memberRepository.deleteById(userId);
    } catch (error) {
      console.error('Kakao API Error:', error.response?.data || error.message);
      throw new Error('회원 탈퇴 처리 중 오류가 발생했습니다.');
    }
  }
}

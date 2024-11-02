import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ConflictError, UnauthorizedError } from '../../global/errorHandler.js';
import { MemberRepository } from './memberRepository.js';
import { AUTH_CONFIG } from '../../../config/authConfig.js';
import {
  DuplicateEmailError,
  InvalidCredentialsError,
  InvalidPasswordError,
  InvalidPhoneNumberError,
  InvalidBirthdayError,
} from './memberError.js';

export class MemberService {
  constructor() {
    this.memberRepository = new MemberRepository();
  }

  async signup(signupData) {
    const { userId, password, userType, ...rest } = signupData;

    const existingUser = await this.memberRepository.findByUserId(userId);
    if (existingUser) {
      throw new DuplicateEmailError();
    }

    if (
      !/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(
        password
      )
    ) {
      throw new InvalidPasswordError();
    }

    const userTypeEnum = userType === 1 ? 'GUARDIAN' : 'ELDERLY';
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.memberRepository.create({
      userId,
      password: hashedPassword,
      userType: userTypeEnum,
      ...rest,
    });

    const accessToken = this.generateAccessToken(user.id);
    const refreshToken = this.generateRefreshToken(user.id);

    return {
      accessToken,
      refreshToken,
      user: {
        ...user,
        id: Number(user.id),
        userType: user.userType === 'GUARDIAN' ? 1 : 2,
      },
    };
  }

  async login(loginData) {
    const { userId, password } = loginData;
    const user = await this.memberRepository.findByUserId(userId);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new InvalidCredentialsError();
    }

    const accessToken = this.generateAccessToken(user.id);
    const refreshToken = this.generateRefreshToken(user.id);

    return {
      accessToken,
      refreshToken,
      user: {
        id: Number(user.id),
        userId: user.userId,
        userName: user.userName,
        userType: user.userType === 'GUARDIAN' ? 1 : 2,
      },
    };
  }

  async refreshToken(refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      const user = await this.memberRepository.findById(BigInt(decoded.userId));

      if (!user) {
        throw new UnauthorizedError('존재하지 않는 사용자입니다.');
      }

      const accessToken = this.generateAccessToken(user.id);

      return {
        accessToken,
        user: {
          ...user,
          id: Number(user.id),
          userType: user.userType === 'GUARDIAN' ? 1 : 2,
        },
      };
    } catch (error) {
      throw new UnauthorizedError('유효하지 않은 리프레시 토큰입니다.');
    }
  }

  generateAccessToken(userId) {
    return jwt.sign(
      { userId: userId.toString() },
      AUTH_CONFIG.jwt.access.secret,
      { expiresIn: AUTH_CONFIG.jwt.access.expiresIn }
    );
  }

  generateRefreshToken(userId) {
    return jwt.sign(
      { userId: userId.toString() },
      AUTH_CONFIG.jwt.refresh.secret,
      { expiresIn: AUTH_CONFIG.jwt.refresh.expiresIn }
    );
  }

  async updateProfile(userId, updateData) {
    const { phoneNumber, birthday } = updateData;

    if (phoneNumber && !/^[0-9]{10,11}$/.test(phoneNumber)) {
      throw new InvalidPhoneNumberError();
    }

    if (birthday) {
      const date = new Date(birthday);
      if (isNaN(date.getTime())) {
        throw new InvalidBirthdayError();
      }
    }

    const updatedUser = await this.memberRepository.update(userId, updateData);
    return {
      id: Number(updatedUser.id),
      userId: updatedUser.userId,
      userName: updatedUser.userName,
      phoneNumber: updatedUser.phoneNumber,
      birthday: updatedUser.birthday.toISOString().split('T')[0],
      userType: updatedUser.userType === 'GUARDIAN' ? 1 : 2,
    };
  }

  async updatePassword(userId, { currentPassword, newPassword }) {
    const user = await this.memberRepository.findById(userId);

    if (!(await bcrypt.compare(currentPassword, user.password))) {
      throw new UnauthorizedError('현재 비밀번호가 일치하지 않습니다.');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.memberRepository.update(userId, { password: hashedPassword });
  }

  async deleteAccount(userId) {
    await this.memberRepository.delete(userId);
  }
}

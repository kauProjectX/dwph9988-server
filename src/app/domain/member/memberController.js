import { signupSchema, loginSchema, updateProfileSchema } from './memberDto.js';
import { MemberService } from './memberService.js';
import { response } from '../../global/response.js';
import { BadRequestError } from '../../global/errorHandler.js';
import { AUTH_CONFIG } from '../../../config/authConfig.js';
import { UnauthorizedError } from '../../global/errorHandler.js';

export class MemberController {
  constructor() {
    this.memberService = new MemberService();
  }

  signup = async (req, res, next) => {
    try {
      const { error, value } = signupSchema.validate(req.body);
      if (error) throw new BadRequestError(error.details[0].message);

      const { accessToken, refreshToken, user } =
        await this.memberService.signup(value);

      res.cookie('refreshToken', refreshToken, AUTH_CONFIG.jwt.cookie);

      res
        .status(201)
        .json(
          response(
            { isSuccess: true, message: '회원가입이 완료되었습니다.' },
            { accessToken, user }
          )
        );
    } catch (err) {
      next(err);
    }
  };

  login = async (req, res, next) => {
    try {
      const { error, value } = loginSchema.validate(req.body);
      if (error) throw new BadRequestError(error.details[0].message);

      const { accessToken, refreshToken, user } =
        await this.memberService.login(value);

      res.cookie('refreshToken', refreshToken, AUTH_CONFIG.jwt.cookie);

      res.json(
        response(
          { isSuccess: true, message: '로그인이 완료되었습니다.' },
          { accessToken, user }
        )
      );
    } catch (err) {
      next(err);
    }
  };

  updateProfile = async (req, res, next) => {
    try {
      const { error, value } = updateProfileSchema.validate(req.body);
      if (error) throw new BadRequestError(error.details[0].message);

      const updatedUser = await this.memberService.updateProfile(
        req.user.id,
        value
      );

      res.json(
        response(
          { isSuccess: true, message: '프로필이 수정되었습니다.' },
          updatedUser
        )
      );
    } catch (err) {
      next(err);
    }
  };

  refreshToken = async (req, res, next) => {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        throw new UnauthorizedError('리프레시 토큰이 없습니다.');
      }

      const { accessToken, user } =
        await this.memberService.refreshToken(refreshToken);

      res.json(
        response(
          { isSuccess: true, message: '토큰이 갱신되었습니다.' },
          { accessToken, user }
        )
      );
    } catch (err) {
      next(err);
    }
  };
}

import { MemberService } from './memberService.js';
import { response } from '../../global/response.js';
import { BadRequestError } from '../../global/errorHandler.js';

export class MemberController {
  constructor() {
    this.memberService = new MemberService();
  }

  getProfile = async (req, res, next) => {
    try {
      const user = await this.memberService.getProfile(req.user.id);

      // 명시적인 상태 코드 설정
      res
        .status(200)
        .json(
          response(
            { isSuccess: true, message: '프로필 조회가 완료되었습니다.' },
            user
          )
        );
    } catch (err) {
      next(err);
    }
  };

  requestConnection = async (req, res, next) => {
    try {
      const { phoneNumber } = req.body;
      const verificationData = await this.memberService.requestConnection(
        req.user.id,
        phoneNumber
      );

      res.json(
        response(
          { isSuccess: true, message: '인증번호가 발송되었습니다.' },
          verificationData
        )
      );
    } catch (err) {
      next(err);
    }
  };

  verifyConnection = async (req, res, next) => {
    try {
      const { verificationCode, protectId } = req.body;
      await this.memberService.verifyConnection(
        req.user.id,
        protectId,
        verificationCode
      );

      res.json(
        response({ isSuccess: true, message: '연동이 완료되었습니다.' })
      );
    } catch (err) {
      next(err);
    }
  };

  kakaoLogin = async (req, res, next) => {
    try {
      if (req.query.access_token) {
        const userInfo = await this.getKakaoUserInfo(req.query.access_token);
        const kakaoData = {
          kakaoId: userInfo.id.toString(),
          email: userInfo.kakao_account?.email,
          nickname: userInfo.kakao_account?.profile?.nickname,
        };

        const { accessToken, user } =
          await this.memberService.kakaoLogin(kakaoData);
        return res.json(
          response(
            { isSuccess: true, message: '카카오 로그인 성공' },
            { accessToken, user }
          )
        );
      }

      const kakaoAuthURL = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.KAKAO_CLIENT_ID}&redirect_uri=${process.env.KAKAO_REDIRECT_URI}&response_type=code`;
      res.redirect(kakaoAuthURL);
    } catch (err) {
      next(err);
    }
  };

  logout = async (req, res, next) => {
    try {
      const accessToken = req.headers.authorization?.split(' ')[1];
      await this.memberService.logout(req.user.id, accessToken);

      res.json(
        response({
          isSuccess: true,
          message:
            '로그아웃이 완료되었습니다. 클라이언트에서 토큰을 삭제해주세요.',
        })
      );
    } catch (err) {
      next(err);
    }
  };

  withdraw = async (req, res, next) => {
    try {
      const accessToken = req.headers.authorization?.split(' ')[1];
      await this.memberService.withdraw(req.user.id, accessToken);
      res.json(
        response({
          isSuccess: true,
          message:
            '회원 탈퇴가 완료되었습니다. 카카오 계정에서도 로그아웃되었습니다.',
        })
      );
    } catch (err) {
      next(err);
    }
  };
}

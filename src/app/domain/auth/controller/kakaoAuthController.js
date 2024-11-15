import axios from 'axios';
import { MemberService } from '../../member/memberService.js';
import { response } from '../../../global/response.js';
import { UnauthorizedError } from '../../../global/errorHandler.js';
import { BadRequestError } from '../../../global/errorHandler.js';

export class KakaoAuthController {
  constructor() {
    this.memberService = new MemberService();
  }

  // 카카오 로그인 페이지로 리다이렉트
  kakaoLogin = async (req, res) => {
    const kakaoAuthURL = `https://kauth.kakao.com/oauth/authorize?client_id=${
      process.env.KAKAO_CLIENT_ID
    }&redirect_uri=${encodeURIComponent(
      process.env.KAKAO_REDIRECT_URI
    )}&response_type=code&prompt=login_consent&state=${Date.now()}&scope=profile_nickname,account_email`;

    res.redirect(kakaoAuthURL);
  };

  // 카카오 콜백 처리
  kakaoCallback = async (req, res, next) => {
    try {
      const { code, error, error_description } = req.query;

      // 에러가 있는 경우 처리
      if (error) {
        throw new BadRequestError(error_description || error);
      }

      // code가 없는 경우 처리
      if (!code) {
        console.log('Query parameters:', req.query);
        throw new BadRequestError('Authorization code is missing');
      }

      // 코드로 액세스 토큰 받기
      const tokenResponse = await axios.post(
        'https://kauth.kakao.com/oauth/token',
        null,
        {
          params: {
            grant_type: 'authorization_code',
            client_id: process.env.KAKAO_CLIENT_ID,
            client_secret: process.env.KAKAO_CLIENT_SECRET,
            redirect_uri: process.env.KAKAO_REDIRECT_URI,
            code,
          },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
          },
        }
      );

      const { access_token } = tokenResponse.data;

      // 액세스 토큰으로 사용자 정보 받기
      const userInfo = await this.getKakaoUserInfo(access_token);

      const kakaoData = {
        kakaoId: userInfo.id.toString(),
        email: userInfo.kakao_account?.email,
        nickname: userInfo.kakao_account?.profile?.nickname || '사용자',
      };

      const { accessToken, user } =
        await this.memberService.kakaoLogin(kakaoData);

      // 응답을 더 간단하게
      res.json(
        response(
          {
            isSuccess: true,
            message: '카카오 로그인 성공',
          },
          {
            accessToken,
            user,
          }
        )
      );
    } catch (err) {
      console.error('Kakao Auth Error:', err.response?.data || err.message);
      next(err);
    }
  };

  async getKakaoUserInfo(accessToken) {
    try {
      const { data } = await axios.get('https://kapi.kakao.com/v2/user/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log('Kakao User Info:', {
        id: data.id,
        hasEmail: !!data.kakao_account?.email,
        email: data.kakao_account?.email,
        nickname: data.kakao_account?.profile?.nickname,
      });

      return data;
    } catch (error) {
      console.error('Kakao API Error:', error.response?.data || error.message);
      throw new UnauthorizedError(
        '카카오 사용자 정보를 가져오는데 실패했습니다.'
      );
    }
  }
}

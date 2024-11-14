/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *       description: |
 *         카카오 로그인 후 받은 accessToken으로 API 인증하기:
 *         1. /api/members/social/kakao API 실행 후 응답의 accessToken 복사
 *         2. 우측 상단의 'Authorize' 버튼 클릭
 *         3. 복사한 accessToken 입력 (Bearer 접두어 자동 추가됨)
 *         4. 'Authorize' 버튼 클릭으로 설정 완료
 *         5. 이후 모든 API 요청에 토큰이 자동으로 포함됨
 *   schemas:
 *     ConnectionRequest:
 *       type: object
 *       required:
 *         - phoneNumber
 *       properties:
 *         phoneNumber:
 *           type: string
 *           description: 어르신의 전화번호
 *           example: "01012345678"
 *     ConnectionVerify:
 *       type: object
 *       required:
 *         - protectId
 *         - verificationCode
 *       properties:
 *         protectId:
 *           type: string
 *           description: 연동 요청 ID
 *           example: "123"
 */

/**
 * @swagger
 * /api/members/social/kakao:
 *   get:
 *     tags: [Members]
 *     summary: 카카오 로그인/회원가입
 *     description: |
 *       # 카카오 로그인 방법
 *
 *       ## 웹 브라우저 사용자
 *       ### 개발 환경
 *       - http://localhost:3000/api/members/social/kakao
 *
 *       ### 운영 환경
 *       - https://dwph9988.shop/api/members/social/kakao
 *
 *       현재 서버: ${process.env.NODE_ENV === 'production' ? '운영' : '개발'}
 *       접속 URL: ${process.env.SERVICE_URL}/api/members/social/kakao
 *     responses:
 *       200:
 *         description: 로그인 성공
 */

/**
 * @swagger
 * /api/members/profile:
 *   get:
 *     tags: [Members]
 *     summary: 프로필 조회
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 프로필 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isSuccess:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "프로필 조회가 완료되었습니다."
 *                 result:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     userName:
 *                       type: string
 *                       example: "박준규"
 *                     userType:
 *                       type: string
 *                       example: "GUARDIAN"
 *                     kakaoId:
 *                       type: string
 *                       example: "12345678"
 *                     email:
 *                       type: string
 *                       nullable: true
 *                       example: "example@kakao.com"
 *
 * /api/members/connect/request:
 *   post:
 *     tags: [Members]
 *     summary: 어르신 연동 요청
 *     security:
 *       - bearerAuth: []
 *     description: |
 *       어르신의 전화번호로 인증번호를 발송합니다.
 *       * SMS 또는 카카오톡으로 발송 가능
 *       * 인증번호는 30분간 유효
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ConnectionRequest'
 *     responses:
 *       200:
 *         description: 인증번호 발송 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isSuccess:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "인증번호가 발송되었습니다."
 *                 result:
 *                   type: object
 *                   properties:
 *                     protectId:
 *                       type: string
 *                       example: "123"
 *                     expiresIn:
 *                       type: string
 *                       example: "30분"
 *
 * /api/members/connect/verify:
 *   post:
 *     tags: [Members]
 *     summary: 어르신 연동 인증
 *     security:
 *       - bearerAuth: []
 *     description: |
 *       발송된 인증번호를 확인하여 연동을 완료합니다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ConnectionVerify'
 *     responses:
 *       200:
 *         description: 연동 성공
 */

/**
 * @swagger
 * /api/members/logout:
 *   post:
 *     tags: [Members]
 *     summary: 로그아웃
 *     security:
 *       - bearerAuth: []
 *     description: |
 *       카카오 로그아웃을 수행합니다.
 *     responses:
 *       200:
 *         description: 로그아웃 성공
 *
 * /api/members/withdraw:
 *   delete:
 *     tags: [Members]
 *     summary: 회원 탈퇴
 *     security:
 *       - bearerAuth: []
 *     description: |
 *       회원 탈퇴를 수행합니다.
 *       - 카카오 연동 해제
 *       - DB에서 회원 정보 삭제
 *     responses:
 *       200:
 *         description: 회원 탈퇴 성공
 */

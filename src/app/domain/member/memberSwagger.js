/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *       description: |
 *         인증이 필요한 API를 테스트하기 위한 절차:
 *         1. /login API를 실행하여 accessToken을 받습니다.
 *         2. 상단의 'Authorize' 버튼을 클릭합니다.
 *         3. 토큰값만 입력합니다. ('Bearer' 접두어는 자동으로 추가됩니다)
 *         4. 'Authorize' 버튼을 클릭하여 저장합니다.
 *   schemas:
 *     SignupRequest:
 *       type: object
 *       required:
 *         - userId
 *         - password
 *         - userName
 *         - phoneNumber
 *         - birthday
 *         - userType
 *       properties:
 *         userId:
 *           type: string
 *           format: email
 *           description: 사용자 이메일 주소 (로그인 시 사용)
 *           example: user@example.com
 *         password:
 *           type: string
 *           minLength: 8
 *           description: |
 *             비밀번호 규칙:
 *             * 최소 8자 이상
 *             * 영문, 숫자, 특수문자(!@#$%^&*) 각각 1개 이상 포함
 *           example: "Password123!"
 *         userName:
 *           type: string
 *           description: 사용자 실명
 *           example: "홍길동"
 *         phoneNumber:
 *           type: string
 *           pattern: "^[0-9]{10,11}$"
 *           description: 전화번호 (숫자만 입력, 10-11자리)
 *           example: "01012345678"
 *         birthday:
 *           type: string
 *           format: date
 *           description: 생년월일 (YYYY-MM-DD)
 *           example: "1990-01-01"
 *         userType:
 *           type: integer
 *           enum: [1, 2]
 *           description: |
 *             사용자 유형 (필수 선택):
 *             * 1 = 보호자 (GUARDIAN)
 *             * 2 = 어르신 (ELDERLY)
 *           example: 1
 *     LoginRequest:
 *       type: object
 *       required:
 *         - userId
 *         - password
 *       properties:
 *         userId:
 *           type: string
 *           format: email
 *           description: 가입 시 등록한 이메일 주소
 *           example: "user@example.com"
 *         password:
 *           type: string
 *           description: 가입 시 등록한 비밀번호
 *           example: "Password123!"
 *     UpdateProfileRequest:
 *       type: object
 *       properties:
 *         userName:
 *           type: string
 *           description: 사용자 실명
 *           example: "홍길동"
 *         phoneNumber:
 *           type: string
 *           pattern: "^[0-9]{10,11}$"
 *           description: 전화번호 (숫자만 입력, 10-11자리)
 *           example: "01012345678"
 *         birthday:
 *           type: string
 *           format: date
 *           description: 생년월일 (YYYY-MM-DD)
 *           example: "1990-01-01"
 *   responses:
 *     ValidationError:
 *       description: 유효성 검사 실패
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isSuccess:
 *                 type: boolean
 *                 example: false
 *               message:
 *                 type: string
 *                 example: "비밀번호는 영문, 숫자, 특수문자를 포함한 8자 이상이어야 합니다."
 */

/**
 * @swagger
 * /api/members/signup:
 *   post:
 *     tags: [Members]
 *     summary: 회원가입
 *     description: |
 *       새로운 사용자를 등록합니다.
 *       * 모든 필드는 필수입니다.
 *       * 비밀번호는 영문, 숫자, 특수문자를 포함해야 합니다.
 *       * 전화번호는 숫자만 입력해야 합니다.
 *       * 회원가입 성공 시:
 *         - accessToken이 응답 본문에 포함됩니다.
 *         - refreshToken이 쿠키로 자동 설정됩니다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SignupRequest'
 *     responses:
 *       201:
 *         description: 회원가입 성공
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
 *                   example: "회원가입이 완료되었습니다."
 *                 result:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                       description: API 요청 시 Authorization 헤더에 사용
 *                       example: "eyJhbGciOiJIUzI1NiIs..."
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 1
 *                         userId:
 *                           type: string
 *                           example: "user@example.com"
 *                         userName:
 *                           type: string
 *                           example: "홍길동"
 *                         userType:
 *                           type: integer
 *                           example: 1
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       409:
 *         description: 이메일 중복
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isSuccess:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "이미 사용 중인 이메일입니다."
 *
 * /api/members/login:
 *   post:
 *     tags: [Members]
 *     summary: 로그인
 *     description: |
 *       이메일과 비밀번호로 로그인합니다.
 *       * 로그인 성공 시:
 *         - accessToken이 응답 본문에 포함됩니다. (API 인증에 사용)
 *         - refreshToken이 쿠키로 자동 설정됩니다. (토큰 갱신에 사용)
 *       * API 요청 시 accessToken을 Authorization 헤더에 포함:
 *         ```
 *         Authorization: Bearer eyJhbGci...
 *         ```
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: 로그인 성공
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
 *                   example: "로그인이 완료되었습니다."
 *                 result:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                       description: API 요청 시 Authorization 헤더에 사용
 *                       example: "eyJhbGciOiJIUzI1NiIs..."
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 1
 *                         userId:
 *                           type: string
 *                           example: "user@example.com"
 *                         userName:
 *                           type: string
 *                           example: "홍길동"
 *                         userType:
 *                           type: integer
 *                           example: 1
 *       401:
 *         description: 인증 실패 (이메일 또는 비밀번호 불일치)
 *
 * /api/members/profile:
 *   put:
 *     tags: [Members]
 *     summary: 프로필 수정
 *     security:
 *       - bearerAuth: []
 *     description: |
 *       사용자 프로필 정보를 수정합니다.
 *       * Authorization 헤더에 Bearer 토큰이 필요합니다.
 *       * 수정하고자 하는 필드만 전송하면 됩니다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProfileRequest'
 *     responses:
 *       200:
 *         description: 프로필 수정 성공
 *       401:
 *         description: 인증 실패 (토큰 없음 또는 유효하지 않은 토큰)
 *       400:
 *         description: 잘못된 요청 (유효성 검사 실패)
 *
 * /api/members/refresh:
 *   post:
 *     tags: [Members]
 *     summary: 액세스 토큰 갱신
 *     description: |
 *       리프레시 토큰을 사용하여 새로운 액세스 토큰을 발급받습니다.
 *       * 리프레시 토큰은 쿠키에서 자동으로 전송됩니다.
 *     responses:
 *       200:
 *         description: 토큰 갱신 성공
 *       401:
 *         description: 유효하지 않은 리프레시 토큰
 */

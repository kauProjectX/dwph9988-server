/**
 * @swagger
 * tags:
 *   name: Heat
 *   description: 날씨 정보와 네비게이션 관련 API
 */

/**
 * @swagger
 * /api/heat/weather:
 *   get:
 *     tags: [Heat]
 *     summary: 현재 위치의 날씨와 온도 정보 조회
 *     description: 기상청 API를 통해 특정 좌표의 현재 온도와 위치 정보를 조회합니다.
 *     parameters:
 *       - in: query
 *         name: nx
 *         required: true
 *         description: 예보지점 X 좌표
 *         schema:
 *           type: integer
 *         example: 60
 *       - in: query
 *         name: ny
 *         required: true
 *         description: 예보지점 Y 좌표
 *         schema:
 *           type: integer
 *         example: 127
 *     responses:
 *       200:
 *         description: 현재 위치의 날씨와 온도 정보를 성공적으로 조회
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 temperature:
 *                   type: number
 *                   description: 현재 기온
 *                   example: 25.7
 *                 location:
 *                   type: string
 *                   description: 위치 정보
 *                   example: "고양시"
 *       400:
 *         description: 잘못된 요청
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "nx와 ny 좌표를 전달해주세요."
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "서버 오류가 발생했습니다."
 *                 error:
 *                   type: string
 *                   example: "날씨 정보를 가져오는 중 오류가 발생했습니다."
 */

/**
 * @swagger
 * /api/heat/navigation:
 *   get:
 *     tags: [Heat]
 *     summary: 네이버 지도 네비게이션 링크 생성
 *     description: 특정 위치로의 네이버 지도 도보 길찾기 링크를 생성합니다.
 *     parameters:
 *       - in: query
 *         name: Lat
 *         required: true
 *         description: 목적지 위도
 *         schema:
 *           type: number
 *           format: float
 *         example: 35.9651517
 *       - in: query
 *         name: Lot
 *         required: true
 *         description: 목적지 경도
 *         schema:
 *           type: number
 *           format: float
 *         example: 129.4124369
 *       - in: query
 *         name: Name
 *         required: true
 *         description: 목적지 이름
 *         schema:
 *           type: string
 *         example: "문덕4리 할머니"
 *     responses:
 *       200:
 *         description: 네비게이션 링크 생성 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "네비게이션 링크가 생성되었습니다."
 *                 mobileAppLink:
 *                   type: string
 *                   description: 네이버 지도 앱으로 연결되는 링크
 *                   example: "nmap://route/walk?dlat=35.9651517&dlng=129.4124369&dname=문덕4리 할머니"
 *                 webBrowserLink:
 *                   type: string
 *                   description: 웹 브라우저용 네이버 지도 링크
 *                   example: "https://map.naver.com/v5/directions/-/-/-/walk?c=129.4124369,35.9651517,15,0,0,0,dh&destination=문덕4리 할머니"
 *       400:
 *         description: 잘못된 요청
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "위도 좌표는 필수입니다."
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "서버 오류가 발생했습니다."
 *                 error:
 *                   type: string
 *                   example: "네이버 지도 링크 생성 중 오류가 발생했습니다."
 */

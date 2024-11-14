/**
 * @swagger
 * tags:
 *   name: Shelters
 *   description: 무더위쉼터 관리 API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Shelter:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: 쉼터 고유 ID
 *         facilityName:
 *           type: string
 *           description: 시설명
 *         address:
 *           type: string
 *           description: 주소
 *         latitude:
 *           type: number
 *           format: float
 *           description: 위도
 *         longitude:
 *           type: number
 *           format: float
 *           description: 경도
 *         phoneNumber:
 *           type: string
 *           description: 연락처
 *         operatingTime:
 *           type: string
 *           description: 운영시간
 *         facilityType:
 *           type: string
 *           description: 시설유형
 */

/**
 * @swagger
 * /api/shelters:
 *   get:
 *     summary: 무더위쉼터 목록 조회
 *     tags: [Shelters]
 *     parameters:
 *       - in: query
 *         name: latitude
 *         schema:
 *           type: number
 *         description: 현재 위치 위도
 *       - in: query
 *         name: longitude
 *         schema:
 *           type: number
 *         description: 현재 위치 경도
 *       - in: query
 *         name: radius
 *         schema:
 *           type: number
 *         description: 검색 반경(km)
 *     responses:
 *       200:
 *         description: 무더위쉼터 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Shelter'
 *       400:
 *         description: 잘못된 요청
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *       500:
 *         description: 서버 에러
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 */

export {};

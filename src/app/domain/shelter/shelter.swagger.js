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
 *         name:
 *           type: string
 *           description: 무더위쉼터 이름
 *         latitude:
 *           type: number
 *           format: float
 *           description: 위도
 *         longitude:
 *           type: number
 *           format: float
 *           description: 경도
 */

/**
 * @swagger
 * /api/shelters:
 *   get:
 *     summary: GPS 위치 기준으로 무더위쉼터 조회
 *     tags: [Shelters]
 *     parameters:
 *       - in: query
 *         name: latitude
 *         required: true
 *         schema:
 *           type: number
 *         description: GPS 위도
 *         example: 37.5666805
 *       - in: query
 *         name: longitude
 *         required: true
 *         schema:
 *           type: number
 *         description: GPS 경도
 *         example: 126.9784147
 *     responses:
 *       200:
 *         description: 가장 가까운 무더위쉼터 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Shelter'
 *       400:
 *         description: GPS 위치 정보 누락
 *       500:
 *         description: 서버 에러
 */

export {};

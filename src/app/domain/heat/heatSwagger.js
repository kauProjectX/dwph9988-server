/**
 * @swagger
 * /heat/weather:
 *   get:
 *     summary: 현재 위치의 날씨와 온도 정보 조회
 *     parameters:
 *       - in: query
 *         name: nx
 *         required: true
 *         description: 예보지점 X 좌표
 *         schema:
 *           type: integer
 *       - in: query
 *         name: ny
 *         required: true
 *         description: 예보지점 Y 좌표
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 현재 위치의 날씨와 온도 정보
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 temperature:
 *                   type: string
 *                 location:
 *                   type: string
 *       400:
 *         description: 잘못된 요청
 *       500:
 *         description: 서버 오류
 */

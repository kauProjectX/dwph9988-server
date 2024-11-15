import { getNearestShelters } from './shelter.service.js';

export const getShelters = async (req, res) => {
  try {
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        message: '위도와 경도가 필요합니다.',
      });
    }

    const nearestShelters = await getNearestShelters(
      parseFloat(latitude),
      parseFloat(longitude)
    );

    return res.json(nearestShelters);
  } catch (error) {
    console.error('쉼터 조회 에러:', error);
    return res.status(500).json({
      message: '서버 에러가 발생했습니다.',
    });
  }
};

import { getShelterList } from './shelterService.js';

export const getShelters = async (req, res, next) => {
  try {
    const { latitude, longitude, radius = 2 } = req.query; // 기본 반경 2km

    if (!latitude || !longitude) {
      return res.status(400).json({
        status: 'error',
        message: '위도와 경도는 필수 파라미터입니다.',
      });
    }

    const shelters = await getShelterList(latitude, longitude, radius);
    res.json(shelters);
  } catch (error) {
    next(error);
  }
};

import { getWeatherData } from './heatService.js';

export const getHeatInfo = async (req, res) => {
  try {
    const { nx, ny } = req.query; // 요청 시 좌표 (nx, ny)를 받음
    if (!nx || !ny) {
      return res.status(400).json({ message: 'nx와 ny 좌표를 전달해주세요.' });
    }

    // 서비스에서 공공 데이터 API 호출 및 정보 획득
    const weatherInfo = await getWeatherData(nx, ny);
    res.status(200).json(weatherInfo);
  } catch (error) {
    res.status(500).json({ message: '서버 오류가 발생했습니다.', error: error.message });
  }
};

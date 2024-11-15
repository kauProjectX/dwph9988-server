import { getWeatherData } from './heatService.js';
import { getNaverMapNavigation } from './heatService.js';
import { navigationQuerySchema } from './heatDto.js';

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

export const getNavigationLink = async (req, res) => {
  try {
    // 요청 데이터 검증
    const { error, value } = navigationQuerySchema.validate(req.query);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { Lat, Lot, Name } = value;
    
    // 네이버 지도 네비게이션 링크 생성
    const navigationLinks = getNaverMapNavigation(Lat, Lot, Name);
    
    res.status(200).json({
      message: '네비게이션 링크가 생성되었습니다.',
      ...navigationLinks
    });
  } catch (error) {
    res.status(500).json({ message: '서버 오류가 발생했습니다.', error: error.message });
  }
};

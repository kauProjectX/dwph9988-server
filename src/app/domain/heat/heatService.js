import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const KMA_BASE_URL = process.env.KMA_BASE_URL;
const KMA_SERVICE_KEY = process.env.KMA_SERVICE_KEY;
const NAVER_CLIENT_ID = process.env.NAVER_CLIENT_ID;
const NAVER_CLIENT_SECRET = process.env.NAVER_CLIENT_SECRET;

// 좌표를 주소로 변환하는 함수 (네이버 지도 API 사용)
const getAddressFromCoordinates = async (nx, ny) => {
  try {
    const response = await axios.get('https://naveropenapi.apigw.ntruss.com/map-reversegeocode/v2/gc', {
      params: {
        coords: `${ny},${nx}`, // '경도,위도' 형식 (ny가 경도, nx가 위도)
        orders: 'roadaddr,addr', // 도로명 주소와 지번 주소를 포함하여 요청
        output: 'json',
      },
      headers: {
        'X-NCP-APIGW-API-KEY-ID': NAVER_CLIENT_ID,
        'X-NCP-APIGW-API-KEY': NAVER_CLIENT_SECRET,
      },
    });
    console.log('Reverse Geocoding Response:', response.data);
    // 응답 데이터에서 주소 정보 추출
    const results = response.data.results;
    if (results && results.length > 0) {
      const addressInfo = results[0].region.area3.name; // 지역명을 가져옴 (구/군 수준)
      return addressInfo || `(좌표: ${nx}, ${ny})`;
    } else {
      return `(좌표: ${nx}, ${ny})`;
    }
  } catch (error) {
    console.error('주소 변환 중 오류 발생:', error.message);
    return `(좌표: ${nx}, ${ny})`;
  }
};

// 기상청 날씨 데이터를 가져오는 함수
export const getWeatherData = async (nx, ny) => {
  const currentDate = new Date();
  const baseDate = currentDate.toISOString().split('T')[0].replace(/-/g, ''); // yyyyMMdd 형식
  const baseTime = '0600'; // 발표 시각 - 일반적으로 오전 6시 (기상청 발표 시간에 따라 조정 필요)

  try {
    // 기상청 API 호출
    const response = await axios.get(KMA_BASE_URL, {
      params: {
        serviceKey: KMA_SERVICE_KEY,
        numOfRows: 10,
        pageNo: 1,
        dataType: 'JSON',
        base_date: baseDate,
        base_time: baseTime,
        nx,
        ny,
      },
    });

    if (response.data.response.header.resultCode !== '00') {
      throw new Error(response.data.response.header.resultMsg);
    }

    const items = response.data.response.body.items.item;
    const temperatureItem = items.find(item => item.category === 'T1H');
    const temperature = parseFloat(temperatureItem.obsrValue); // 숫자 값만 반환

    // 좌표로부터 주소 가져오기 (네이버 API 사용)
    const location = await getAddressFromCoordinates(nx, ny);

    return {
      temperature: temperature,
      location: location,
    };
  } catch (error) {
    throw new Error('날씨 정보를 가져오는 중 오류가 발생했습니다: ' + error.message);
  }
};
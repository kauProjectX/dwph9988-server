import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const KMA_BASE_URL = process.env.KMA_BASE_URL;
const KMA_SERVICE_KEY = process.env.KMA_SERVICE_KEY;
const NAVER_CLIENT_ID = process.env.NAVER_CLIENT_ID;
const NAVER_CLIENT_SECRET = process.env.NAVER_CLIENT_SECRET;

// 좌표 변환 함수 추가
const gridToWGS84 = (nx, ny) => {
  const RE = 6371.00877; // 지구 반경(km)
  const GRID = 5.0; // 격자 간격(km)
  const SLAT1 = 30.0; // 표준 위도1(도)
  const SLAT2 = 60.0; // 표준 위도2(도)
  const OLON = 126.0; // 기준점 경도(도)
  const OLAT = 38.0; // 기준점 위도(도)
  const XO = 43; // 기준점 X좌표(GRID)
  const YO = 136; // 기준점 Y좌표(GRID)

  const DEGRAD = Math.PI / 180.0;
  const RADDEG = 180.0 / Math.PI;

  const re = RE / GRID;
  const slat1 = SLAT1 * DEGRAD;
  const slat2 = SLAT2 * DEGRAD;
  const olon = OLON * DEGRAD;
  const olat = OLAT * DEGRAD;

  let sn = Math.tan(Math.PI * 0.25 + slat2 * 0.5) / Math.tan(Math.PI * 0.25 + slat1 * 0.5);
  sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn);
  let sf = Math.tan(Math.PI * 0.25 + slat1 * 0.5);
  sf = (Math.pow(sf, sn) * Math.cos(slat1)) / sn;
  let ro = Math.tan(Math.PI * 0.25 + olat * 0.5);
  ro = (re * sf) / Math.pow(ro, sn);

  const rs = {};
  rs.x = nx;
  rs.y = ny;
  let xn = rs.x - XO;
  let yn = ro - rs.y + YO;
  let ra = Math.sqrt(xn * xn + yn * yn);
  if (sn < 0.0) {
    ra = -ra;
  }
  let alat = Math.pow((re * sf) / ra, 1.0 / sn);
  alat = 2.0 * Math.atan(alat) - Math.PI * 0.5;

  let theta = Math.atan2(xn, yn);
  let alon = theta / sn + olon;
  return {
    latitude: alat * RADDEG,
    longitude: alon * RADDEG,
  };
};

// 수정된 getAddressFromCoordinates 함수
const getAddressFromCoordinates = async (nx, ny) => {
  try {
    // nx, ny를 위도(latitude), 경도(longitude)로 변환
    const { latitude, longitude } = gridToWGS84(nx, ny);

    const response = await axios.get('https://naveropenapi.apigw.ntruss.com/map-reversegeocode/v2/gc', {
      params: {
        coords: `${longitude},${latitude}`, // '경도,위도' 형식
        orders: 'roadaddr,addr', // 도로명 주소와 지번 주소를 포함하여 요청
        output: 'json',
      },
      headers: {
        'X-NCP-APIGW-API-KEY-ID': NAVER_CLIENT_ID,
        'X-NCP-APIGW-API-KEY': NAVER_CLIENT_SECRET,
      },
    });

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

export const getNaverMapNavigation = (lat, lot, name) => {
  try {
    // 네이버 지도 도보 길찾기 URL 생성
    // URL 인코딩을 하지 않고 한글 그대로 사용
    const naverMapUrl = `nmap://route/walk?dlat=${lat}&dlng=${lot}&dname=${name}&appname=dwph9988`;
    
    // 웹 URL의 경우에만 인코딩 적용
    const webUrl = `https://map.naver.com/v5/directions/-/-/-/walk?c=${lot},${lat},15,0,0,0,dh&destination=${name}`;

    return {
      mobileAppLink: naverMapUrl,
      webBrowserLink: webUrl
    };
  } catch (error) {
    throw new Error('네이버 지도 링크 생성 중 오류가 발생했습니다: ' + error.message);
  }
};
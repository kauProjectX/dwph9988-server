import axios from 'axios';

export const getShelterList = async (latitude, longitude, radius = 2) => {
  try {
    const baseUrl = 'https://www.safetydata.go.kr/V2/api/DSSP-IF-10942';
    const params = {
      serviceKey: process.env.COOLING_SHELTER_API_KEY,
      pageNo: 1,
      numOfRows: 1000,
      returnType: 'JSON',
    };

    const response = await axios.get(baseUrl, { params });
    const shelters = response.data.body || [];

    const userLat = parseFloat(latitude);
    const userLon = parseFloat(longitude);
    const searchRadius = parseFloat(radius);

    const latRange = searchRadius / 111;
    const lonRange = searchRadius / (111 * Math.cos((userLat * Math.PI) / 180));

    const roughFiltered = shelters.filter((shelter) => {
      const shelterLat = parseFloat(shelter.LA);
      const shelterLon = parseFloat(shelter.LO);

      return (
        Math.abs(shelterLat - userLat) <= latRange &&
        Math.abs(shelterLon - userLon) <= lonRange
      );
    });

    const filteredShelters = roughFiltered
      .map((shelter) => {
        const distance = calculateDistance(
          userLat,
          userLon,
          parseFloat(shelter.LA),
          parseFloat(shelter.LO)
        );
        return { ...shelter, distance };
      })
      .filter((shelter) => shelter.distance <= searchRadius)
      .map((shelter) => ({
        id: shelter.RSTR_FCLTY_NO,
        facilityName: shelter.RSTR_NM,
        address: shelter.RN_DTL_ADRES || shelter.DTL_ADRES,
        latitude: parseFloat(shelter.LA),
        longitude: parseFloat(shelter.LO),
        distance: shelter.distance.toFixed(2),
        operatingTime: formatOperatingTime(
          shelter.WKDAY_OPER_BEGIN_TIME,
          shelter.WKDAY_OPER_END_TIME
        ),
        facilityType: getFacilityTypeName(shelter.FCLTY_TY),
      }))
      .sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));

    return {
      status: 'success',
      data: filteredShelters,
    };
  } catch (error) {
    console.error('Shelter API Error:', error);
    throw new Error('무더위쉼터 정보를 가져오는데 실패했습니다.');
  }
};

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function formatOperatingTime(startTime, endTime) {
  if (!startTime || !endTime) return '운영시간 정보 없음';
  const formatTime = (time) => `${time.slice(0, 2)}:${time.slice(2, 4)}`;
  return `${formatTime(startTime)} ~ ${formatTime(endTime)}`;
}

function getFacilityTypeName(code) {
  const types = {
    '001': '경로당',
    '002': '마을회관',
    '003': '주민센터',
    '004': '복지회관',
    '005': '행정복지센터',
    '006': '기타',
  };
  return types[code] || '기타';
}

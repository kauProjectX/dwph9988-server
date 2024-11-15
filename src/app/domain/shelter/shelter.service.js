import axios from 'axios';

export const getNearestShelters = async (latitude, longitude) => {
  try {
    console.log('입력된 위도:', latitude);
    console.log('입력된 경도:', longitude);

    const userLat = parseFloat(latitude) || 0;
    const userLon = parseFloat(longitude) || 0;
    const maxRadius = 4; // 최대 반경 4km
    const minShelters = 5; // 최소 쉼터 개수

    let finalShelters = [];

    for (let radius = 1; radius <= maxRadius; radius++) {
      const latDiff = radius / 111;
      const lonDiff = radius / 88;

      const baseUrl = 'https://www.safetydata.go.kr/V2/api/DSSP-IF-10942';
      const params = {
        serviceKey: process.env.COOLING_SHELTER_API_KEY,
        pageNo: 1,
        numOfRows: 1000,
        returnType: 'JSON',
        startLat: (userLat - latDiff).toFixed(7),
        endLat: (userLat + latDiff).toFixed(7),
        startLot: (userLon - lonDiff).toFixed(7),
        endLot: (userLon + lonDiff).toFixed(7),
      };

      const response = await axios.get(baseUrl, { params });

      const shelterData = response.data?.body || [];

      const shelters = shelterData
        .filter(
          (shelter) =>
            shelter.LA &&
            shelter.LO &&
            shelter.RSTR_NM &&
            shelter.USE_AT === 'Y'
        )
        .map((shelter) => {
          const distance = calculateDistance(
            userLat,
            userLon,
            parseFloat(shelter.LA),
            parseFloat(shelter.LO)
          );
          return {
            name: shelter.RSTR_NM,
            latitude: parseFloat(shelter.LA),
            longitude: parseFloat(shelter.LO),
            distance,
          };
        })
        .filter((shelter) => shelter.distance <= radius);

      finalShelters = finalShelters.concat(shelters);

      if (finalShelters.length >= minShelters) {
        break;
      }
    }

    // 중복 제거
    const uniqueShelters = Array.from(
      new Map(finalShelters.map((shelter) => [shelter.name, shelter])).values()
    );

    uniqueShelters.sort((a, b) => a.distance - b.distance);

    const result = uniqueShelters.slice(0, minShelters).map((shelter) => ({
      name: shelter.name,
      longitude: shelter.longitude,
      latitude: shelter.latitude,
    }));

    console.log(`최종 반환 쉼터:`, result);

    if (result.length > 0) {
      return {
        status: 'success',
        data: result,
      };
    }

    return {
      status: 'success',
      data: [
        {
          name: '주변에 무더위쉼터가 없습니다',
          latitude: userLat,
          longitude: userLon,
        },
      ],
    };
  } catch (error) {
    console.error('서비스 오류:', error);
    if (error.response) {
      console.error('API 응답 에러:', error.response.data);
    }
    throw new Error('무더위쉼터 정보를 가져오는데 실패했습니다.');
  }
};

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const toRad = (value) => {
  return (value * Math.PI) / 180;
};

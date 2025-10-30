export function getLevelColor(level: string): string {
  switch (level) {
    case 'GOOD':
      return '#10b981';
    case 'MODERATE':
      return '#f59e0b';
    case 'UNHEALTHY_SENSITIVE':
      return '#f97316';
    case 'UNHEALTHY':
      return '#ef4444';
    case 'VERY_UNHEALTHY':
      return '#dc2626';
    case 'HAZARDOUS':
      return '#7f1d1d';
    default:
      return '#6b7280';
  }
}

export function getLevelLabel(level: string): string {
  switch (level) {
    case 'GOOD':
      return 'Tốt';
    case 'MODERATE':
      return 'Trung bình';
    case 'UNHEALTHY_SENSITIVE':
      return 'Kém cho nhóm nhạy cảm';
    case 'UNHEALTHY':
      return 'Xấu';
    case 'VERY_UNHEALTHY':
      return 'Rất xấu';
    case 'HAZARDOUS':
      return 'Nguy hại';
    default:
      return 'Không xác định';
  }
}

export function getAQIColor(aqi: number): string {
  if (aqi <= 50) return '#10b981';
  if (aqi <= 100) return '#f59e0b';
  if (aqi <= 150) return '#f97316';
  if (aqi <= 200) return '#ef4444';
  if (aqi <= 300) return '#dc2626';
  return '#7f1d1d';
}

export function getAQILabel(aqi: number): string {
  if (aqi <= 50) return 'Tốt';
  if (aqi <= 100) return 'Trung bình';
  if (aqi <= 150) return 'Kém';
  if (aqi <= 200) return 'Xấu';
  if (aqi <= 300) return 'Rất xấu';
  return 'Nguy hại';
}

export function getAQILevel(aqi: number): 'GOOD' | 'MODERATE' | 'UNHEALTHY_SENSITIVE' | 'UNHEALTHY' | 'VERY_UNHEALTHY' | 'HAZARDOUS' {
  if (aqi <= 50) return 'GOOD';
  if (aqi <= 100) return 'MODERATE';
  if (aqi <= 150) return 'UNHEALTHY_SENSITIVE';
  if (aqi <= 200) return 'UNHEALTHY';
  if (aqi <= 300) return 'VERY_UNHEALTHY';
  return 'HAZARDOUS';
}

export interface AirQualityPoint {
  id: string;
  lat: number;
  lng: number;
  level: string;
  pm25: number;
  co2: number;
  no2: number;
  districtName: string;
  recordedAt: string;
}

export function convertAirQualityToPoint(airQuality: any): AirQualityPoint {
  let lat = airQuality.latitude || airQuality.lat;
  let lng = airQuality.longitude || airQuality.lng;

  if (airQuality.geom || airQuality.location) {
    try {
      const geom = airQuality.geom || airQuality.location;
      const parsed = typeof geom === 'string' ? JSON.parse(geom) : geom;
      
      if (parsed.type === 'Point' && Array.isArray(parsed.coordinates)) {
        [lng, lat] = parsed.coordinates;
      }
    } catch (error) {
      console.warn('Failed to parse geom:', error);
    }
  }

  return {
    id: airQuality.id,
    lat: lat,
    lng: lng,
    level: airQuality.level || 'MODERATE',
    pm25: airQuality.pm25 || 0,
    co2: airQuality.co2 || 0,
    no2: airQuality.no2 || 0,
    districtName: airQuality.district?.name || airQuality.districtName || 'Chưa xác định',
    recordedAt: airQuality.recordedAt || airQuality.recorded_at || new Date().toISOString(),
  };
}

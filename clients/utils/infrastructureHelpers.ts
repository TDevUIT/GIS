export function getInfrastructureColor(category: string): string {
  switch (category) {
    case 'SCHOOL':
      return '#3b82f6';
    case 'HOSPITAL':
      return '#ef4444';
    case 'PARK':
      return '#10b981';
    case 'MARKET':
      return '#f59e0b';
    case 'UTILITY':
      return '#8b5cf6';
    case 'ADMINISTRATIVE':
      return '#6366f1';
    case 'OTHER':
      return '#6b7280';
    default:
      return '#6b7280';
  }
}

export function getInfrastructureLabel(category: string): string {
  switch (category) {
    case 'SCHOOL':
      return 'Trường học';
    case 'HOSPITAL':
      return 'Bệnh viện';
    case 'PARK':
      return 'Công viên';
    case 'MARKET':
      return 'Chợ';
    case 'UTILITY':
      return 'Tiện ích';
    case 'ADMINISTRATIVE':
      return 'Hành chính';
    case 'OTHER':
      return 'Khác';
    default:
      return 'Không xác định';
  }
}

export function getInfrastructureIcon(category: string): string {
  switch (category) {
    case 'SCHOOL':
      return '🏫';
    case 'HOSPITAL':
      return '🏥';
    case 'PARK':
      return '🌳';
    case 'MARKET':
      return '🏪';
    case 'UTILITY':
      return '⚡';
    case 'ADMINISTRATIVE':
      return '🏛️';
    case 'OTHER':
      return '📍';
    default:
      return '📍';
  }
}

export interface InfrastructurePoint {
  id: string;
  lat: number;
  lng: number;
  name: string;
  category: string;
  capacity: number | null;
  status: string;
  districtName: string;
  description: string | null;
}

export function convertInfrastructureToPoint(infrastructure: any): InfrastructurePoint {
  let lat = infrastructure.latitude || infrastructure.lat;
  let lng = infrastructure.longitude || infrastructure.lng;

  if (infrastructure.geom || infrastructure.location) {
    try {
      const geom = infrastructure.geom || infrastructure.location;
      const parsed = typeof geom === 'string' ? JSON.parse(geom) : geom;

      if (parsed.type === 'Point' && Array.isArray(parsed.coordinates)) {
        [lng, lat] = parsed.coordinates;
      }
    } catch (error) {
      console.warn('Failed to parse geom:', error);
    }
  }

  return {
    id: infrastructure.id,
    lat: lat,
    lng: lng,
    name: infrastructure.name || 'Chưa có tên',
    category: infrastructure.category || 'OTHER',
    capacity: infrastructure.capacity || null,
    status: infrastructure.status || 'ACTIVE',
    districtName: infrastructure.district?.name || infrastructure.districtName || 'Chưa xác định',
    description: infrastructure.description || null,
  };
}

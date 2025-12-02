import { TrafficLine } from '@/types';

export function getCongestionColor(level: string): string {
  switch (level) {
    case 'CLEAR':
      return '#10b981'; // green-500
    case 'LIGHT':
      return '#84cc16'; // lime-500
    case 'MODERATE':
      return '#f59e0b'; // amber-500
    case 'HEAVY':
      return '#f97316'; // orange-500
    case 'SEVERE':
      return '#dc2626'; // red-600
    default:
      return '#6b7280'; // gray-500
  }
}

export function getCongestionLabel(level: string): string {
  switch (level) {
    case 'CLEAR':
      return 'Thông thoáng';
    case 'LIGHT':
      return 'Nhẹ';
    case 'MODERATE':
      return 'Trung bình';
    case 'HEAVY':
      return 'Nặng';
    case 'SEVERE':
      return 'Nghẽn nghiêm trọng';
    default:
      return 'Không xác định';
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function convertTrafficToLine(traffic: any): TrafficLine {
  const congestionLevel = (traffic.congestionLevel || traffic.congestion_level || 'MODERATE').toUpperCase();

  // Parse geom if it's a string
  let coordinates: [number, number][] = [];

  try {
    if (traffic.geom) {
      // If geom is a string, parse it
      const geom = typeof traffic.geom === 'string' ? JSON.parse(traffic.geom) : traffic.geom;

      if (geom.type === 'LineString' && Array.isArray(geom.coordinates)) {
        // GeoJSON uses [lng, lat], Leaflet uses [lat, lng], so we need to swap
        coordinates = geom.coordinates.map((coord: number[]) => [coord[1], coord[0]]);
      }
    } else if (traffic.coordinates) {
      coordinates = traffic.coordinates;
    } else if (traffic.path) {
      coordinates = traffic.path;
    } else if (traffic.geometry) {
      const geom = typeof traffic.geometry === 'string' ? JSON.parse(traffic.geometry) : traffic.geometry;
      if (geom.coordinates) {
        coordinates = geom.coordinates.map((coord: number[]) => [coord[1], coord[0]]);
      }
    }
  } catch (error) {
    console.warn('Failed to parse traffic geometry:', error, traffic);
    coordinates = [];
  }

  // Calculate congestion level from traffic volume if not provided
  let finalCongestionLevel = congestionLevel;
  if (!traffic.congestionLevel && !traffic.congestion_level && traffic.trafficVolume) {
    const volume = traffic.trafficVolume;
    if (volume > 20000) finalCongestionLevel = 'HEAVY';
    else if (volume > 15000) finalCongestionLevel = 'MODERATE';
    else if (volume > 10000) finalCongestionLevel = 'LIGHT';
    else finalCongestionLevel = 'CLEAR';
  }

  return {
    id: traffic.id || traffic.trafficId,
    roadName: traffic.roadName || traffic.road_name || 'Chưa xác định',
    trafficVolume: traffic.trafficVolume || traffic.traffic_volume || 0,
    congestionLevel: finalCongestionLevel as 'low' | 'medium' | 'high' | 'severe',
    averageSpeed: traffic.averageSpeed || traffic.average_speed || 30,
    coordinates: coordinates,
    color: getCongestionColor(finalCongestionLevel),
  };
}

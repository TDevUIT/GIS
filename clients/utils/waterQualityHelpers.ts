export function getWaterQualityColor(level: string): string {
  switch (level) {
    case 'EXCELLENT':
      return '#10b981';
    case 'GOOD':
      return '#84cc16';
    case 'MODERATE':
      return '#f59e0b';
    case 'POOR':
      return '#f97316';
    case 'VERY_POOR':
      return '#ef4444';
    case 'UNSUITABLE':
      return '#dc2626';
    default:
      return '#6b7280';
  }
}

export function getWaterQualityLabel(level: string): string {
  switch (level) {
    case 'EXCELLENT':
      return 'Xuất sắc';
    case 'GOOD':
      return 'Tốt';
    case 'MODERATE':
      return 'Trung bình';
    case 'POOR':
      return 'Kém';
    case 'VERY_POOR':
      return 'Rất kém';
    case 'UNSUITABLE':
      return 'Không phù hợp';
    default:
      return 'Không xác định';
  }
}

export interface WaterQualityPoint {
  id: string;
  lat: number;
  lng: number;
  quality: string;
  ph: number;
  dissolvedOxygen: number;
  turbidity: number;
  sourceName: string;
  measuredAt: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function convertWaterQualityToPoint(waterQuality: any): WaterQualityPoint {
  let lat = waterQuality.latitude || waterQuality.lat;
  let lng = waterQuality.longitude || waterQuality.lng;

  if (waterQuality.geom || waterQuality.location) {
    try {
      const geom = waterQuality.geom || waterQuality.location;
      const parsed = typeof geom === 'string' ? JSON.parse(geom) : geom;

      if (parsed.type === 'Point' && Array.isArray(parsed.coordinates)) {
        [lng, lat] = parsed.coordinates;
      }
    } catch (error) {
      console.warn('Failed to parse geom:', error);
    }
  }

  return {
    id: waterQuality.id,
    lat: lat,
    lng: lng,
    quality: waterQuality.quality || 'MODERATE',
    ph: waterQuality.ph || 7.0,
    dissolvedOxygen: waterQuality.dissolvedOxygen || waterQuality.dissolved_oxygen || 0,
    turbidity: waterQuality.turbidity || 0,
    sourceName: waterQuality.source?.name || waterQuality.sourceName || waterQuality.source_name || 'Chưa xác định',
    measuredAt: waterQuality.measuredAt || waterQuality.measured_at || new Date().toISOString(),
  };
}

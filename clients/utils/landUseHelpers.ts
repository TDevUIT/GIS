export function getLandUseColor(type: string): string {
  switch (type) {
    case 'RESIDENTIAL':
      return '#fbbf24';
    case 'COMMERCIAL':
      return '#ec4899';
    case 'INDUSTRIAL':
      return '#8b5cf6';
    case 'AGRICULTURAL':
      return '#84cc16';
    case 'FOREST':
      return '#10b981';
    case 'WATER':
      return '#06b6d4';
    case 'TRANSPORT':
      return '#64748b';
    case 'PUBLIC':
      return '#3b82f6';
    case 'MIXED':
      return '#f97316';
    case 'VACANT':
      return '#d1d5db';
    default:
      return '#6b7280';
  }
}

export function getLandUseLabel(type: string): string {
  switch (type) {
    case 'RESIDENTIAL':
      return 'Khu dân cư';
    case 'COMMERCIAL':
      return 'Thương mại';
    case 'INDUSTRIAL':
      return 'Công nghiệp';
    case 'AGRICULTURAL':
      return 'Nông nghiệp';
    case 'FOREST':
      return 'Rừng';
    case 'WATER':
      return 'Mặt nước';
    case 'TRANSPORT':
      return 'Giao thông';
    case 'PUBLIC':
      return 'Công cộng';
    case 'MIXED':
      return 'Hỗn hợp';
    case 'VACANT':
      return 'Đất trống';
    default:
      return 'Không xác định';
  }
}

export function getLandUseIcon(type: string): string {
  switch (type) {
    case 'RESIDENTIAL':
      return '🏘️';
    case 'COMMERCIAL':
      return '🏬';
    case 'INDUSTRIAL':
      return '🏭';
    case 'AGRICULTURAL':
      return '🌾';
    case 'FOREST':
      return '🌲';
    case 'WATER':
      return '💧';
    case 'TRANSPORT':
      return '🚗';
    case 'PUBLIC':
      return '🏛️';
    case 'MIXED':
      return '🏙️';
    case 'VACANT':
      return '⬜';
    default:
      return '📍';
  }
}

export interface LandUsePolygon {
  id: string;
  type: string;
  area: number;
  zoning: string | null;
  districtName: string;
  description: string | null;
  geometry: any;
}

export function convertLandUseToPolygon(landUse: any): LandUsePolygon {
  return {
    id: landUse.id,
    type: landUse.type || 'VACANT',
    area: landUse.area || 0,
    zoning: landUse.zoning || null,
    districtName: landUse.district?.name || landUse.districtName || 'Chưa xác định',
    description: landUse.description || null,
    geometry: landUse.geom || landUse.geometry || null,
  };
}

export function parseGeoJSON(geom: any): any {
  try {
    if (typeof geom === 'string') {
      return JSON.parse(geom);
    }
    return geom;
  } catch (error) {
    console.warn('Failed to parse geometry:', error);
    return null;
  }
}

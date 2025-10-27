export type TransportMode = 'BUS' | 'METRO' | 'BRT' | 'WATERWAY';

export function getTransportModeColor(mode: TransportMode): string {
  switch (mode) {
    case 'BUS':
      return '#3b82f6';
    case 'METRO':
      return '#ef4444';
    case 'BRT':
      return '#f59e0b';
    case 'WATERWAY':
      return '#06b6d4';
    default:
      return '#6b7280';
  }
}

export function getTransportModeLabel(mode: TransportMode): string {
  switch (mode) {
    case 'BUS':
      return 'Xe buýt';
    case 'METRO':
      return 'Metro';
    case 'BRT':
      return 'BRT';
    case 'WATERWAY':
      return 'Đường thủy';
    default:
      return 'Không xác định';
  }
}

export function getTransportModeIcon(mode: TransportMode): string {
  switch (mode) {
    case 'BUS':
      return '🚌';
    case 'METRO':
      return '🚇';
    case 'BRT':
      return '🚍';
    case 'WATERWAY':
      return '⛴️';
    default:
      return '🚏';
  }
}

export interface PublicTransportRoute {
  id: string;
  routeName: string;
  routeNumber: string;
  mode: TransportMode;
  operator: string | null;
  frequency: number | null;
  geometry: any;
}

export function convertPublicTransportToRoute(transport: any): PublicTransportRoute {
  return {
    id: transport.id,
    routeName: transport.routeName || transport.route_name || 'Chưa có tên',
    routeNumber: transport.routeNumber || transport.route_number || 'N/A',
    mode: transport.mode || 'BUS',
    operator: transport.operator || null,
    frequency: transport.frequency || null,
    geometry: transport.geom || transport.geometry || null,
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

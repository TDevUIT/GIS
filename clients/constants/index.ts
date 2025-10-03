

export const API_ENDPOINTS = {
  TRAFFIC: '/traffic',
  AIR_QUALITY: '/air-quality',
  DISTRICTS: '/districts',
  WARDS: '/wards',
  INCIDENTS: '/incidents',
  REPORTS: '/reports',
  GIS: '/gis'
};

export const MAP_CONFIG = {
  DEFAULT_CENTER: {
    latitude: 10.8231,
    longitude: 106.6297
  },
  DEFAULT_ZOOM: 11,
  BASEMAP_TYPES: {
    STREETS: 'streets-vector',
    SATELLITE: 'satellite',
    HYBRID: 'hybrid',
    TOPO: 'topo-vector'
  }
};

export const AQI_LEVELS = {
  GOOD: { min: 0, max: 50, color: '#00e400', label: 'Good' },
  MODERATE: { min: 51, max: 100, color: '#ffff00', label: 'Moderate' },
  UNHEALTHY_SENSITIVE: { min: 101, max: 150, color: '#ff7e00', label: 'Unhealthy for Sensitive Groups' },
  UNHEALTHY: { min: 151, max: 200, color: '#ff0000', label: 'Unhealthy' },
  VERY_UNHEALTHY: { min: 201, max: 300, color: '#8f3f97', label: 'Very Unhealthy' },
  HAZARDOUS: { min: 301, max: 500, color: '#7e0023', label: 'Hazardous' }
};

export const TRAFFIC_LEVELS = {
  LOW: { color: '#00e400', label: 'Low Traffic' },
  MEDIUM: { color: '#ffff00', label: 'Medium Traffic' },
  HIGH: { color: '#ff0000', label: 'Heavy Traffic' }
};

export const INCIDENT_PRIORITIES = {
  LOW: { color: '#00e400', label: 'Low Priority' },
  MEDIUM: { color: '#ffff00', label: 'Medium Priority' },
  HIGH: { color: '#ff0000', label: 'High Priority' }
};

export const DATE_RANGES = {
  LAST_7_DAYS: '7d',
  LAST_30_DAYS: '30d',
  LAST_3_MONTHS: '3m',
  LAST_6_MONTHS: '6m',
  LAST_YEAR: '1y'
};

export const REPORT_TYPES = {
  TRAFFIC: 'traffic',
  AIR_QUALITY: 'air_quality',
  INCIDENTS: 'incidents',
  COMPREHENSIVE: 'comprehensive'
};

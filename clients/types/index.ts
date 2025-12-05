
export interface Location {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address?: string;
}

export interface District {
  id: string;
  name: string;
  code: string;
  areaKm2?: number;
  densityPerKm2?: number;
  createdAt?: string;
  updatedAt?: string;
  boundary?: number[][];
}

export interface DistrictGIS {
  id: string;
  name: string;
  code: string;
  areaKm2?: number;
  densityPerKm2?: number;
  geom?: any; // GeoJSON geometry or WKT string
  createdAt?: string;
  updatedAt?: string;
}

export interface DistrictGeoJSON {
  type: 'Feature';
  id: string;
  properties: {
    id: string;
    name: string;
    code: string;
    areaKm2?: number;
    densityPerKm2?: number;
    population?: number;
  };
  geometry: {
    type: 'Polygon' | 'MultiPolygon';
    coordinates: number[][][] | number[][][][];
  };
}

export interface Ward {
  id: string;
  name: string;
  code: string;
  districtId: string;
  createdAt?: string;
  updatedAt?: string;
  boundary?: number[][];
}

export interface WardGIS {
  id: string;
  name: string;
  code: string;
  districtId: string;
  geom?: any;
  createdAt?: string;
  updatedAt?: string;
}

export interface WardGeoJSON {
  type: 'Feature';
  id: string;
  properties: {
    id: string;
    name: string;
    code: string;
    districtId: string;
    districtName?: string;
  };
  geometry: {
    type: 'Polygon' | 'MultiPolygon';
    coordinates: number[][][] | number[][][][];
  };
}

export interface Accident {
  id: string;
  accidentDate: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  casualties: number;
  trafficId: string;
  roadName?: string;
  location?: {
    lat: number;
    lng: number;
  };
  images?: string[];
}

export interface AccidentPoint {
  id: string;
  lat: number;
  lng: number;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  casualties: number;
  roadName: string;
  accidentDate: string;
}

export interface Traffic {
  id: string;
  roadName: string;
  trafficVolume: number;
  lengthKm: number;
  geom?: string;
  districtId: string;
  coordinates?: number[][];
}

export interface TrafficLine {
  id: string;
  roadName: string;
  trafficVolume: number;
  congestionLevel: 'low' | 'medium' | 'high' | 'severe';
  averageSpeed: number;
  coordinates: number[][];
  color: string;
}

export interface TrafficData {
  id: string;
  location: Location;
  timestamp: Date;
  vehicleCount: number;
  averageSpeed: number;
  congestionLevel: 'low' | 'medium' | 'high';
}

export interface AirQualityData {
  id: string;
  location: Location;
  timestamp: Date;
  aqi: number;
  pm25: number;
  pm10: number;
  no2: number;
  so2: number;
  co: number;
  o3: number;
}

export interface Incident {
  id: string;
  title: string;
  description: string;
  location: Location;
  type: 'traffic' | 'environmental' | 'emergency';
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'in_progress' | 'resolved';
  createdAt: Date;
  updatedAt: Date;
}

export interface Report {
  id: string;
  title: string;
  description: string;
  type: 'traffic' | 'air_quality' | 'incidents';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: Date;
  completedAt?: Date;
  downloadUrl?: string;
}

// UI-related types
export * from './ui';

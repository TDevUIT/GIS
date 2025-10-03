
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
  boundary: number[][];
}

export interface Ward {
  id: string;
  name: string;
  code: string;
  districtId: string;
  boundary: number[][];
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

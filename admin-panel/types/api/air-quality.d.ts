import type { GeoJSONPoint } from './shared';

export interface AirQuality {
  id: string;
  pm25: number | null;
  co2: number | null;
  no2: number | null;
  recordedAt: string;
  geom: GeoJSONPoint | null;
  districtId: string;
  districtName?: string;
}

export type CreateAirQualityDTO = Omit<AirQuality, 'id' | 'geom' | 'districtName'> & { geom: string };

export type UpdateAirQualityDTO = Partial<CreateAirQualityDTO>;

export interface FindAirQualitiesQuery {
  districtId?: string;
  from?: string;
  to?: string;
}

export interface FindWithinRadiusQuery {
  lng: number;
  lat: number;
  radiusInMeters: number;
}

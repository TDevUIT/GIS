import type { GeoJSONPoint } from './shared';

export interface AirQuality {
  id: string;
  pm25: number | null;
  co2: number | null;
  no2: number | null;
  recordedAt: string;
  geom: GeoJSONPoint;
  districtId: string;
}

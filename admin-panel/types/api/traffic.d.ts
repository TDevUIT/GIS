import type { GeoJSONLineString } from './shared';

export interface Traffic {
  id: string;
  roadName: string;
  trafficVolume: number | null;
  updatedAt: string;
  geom: GeoJSONLineString;
  districtId: string;
}

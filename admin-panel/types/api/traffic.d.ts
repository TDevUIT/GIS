import type { GeoJSONLineString } from './shared';

export interface Traffic {
  id: string;
  roadName: string;
  trafficVolume: number | null;
  lengthKm: number | null;   
  createdAt: string;         
  updatedAt: string;
  geom: GeoJSONLineString | null;
  districtId: string;
  districtName?: string;
}

export type CreateTrafficDTO = Omit<Traffic, 'id' | 'createdAt' | 'updatedAt' | 'geom' | 'districtName'> & { geom: string };

export type UpdateTrafficDTO = Partial<CreateTrafficDTO>;

export interface FindTrafficsQuery {
  districtId?: string;
  roadName?: string;
}

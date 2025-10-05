import type { GeoJSONPoint } from './shared';

export interface WaterQuality {
  id: string;
  ph: number | null;
  turbidity: number | null;
  contaminationIndex: number | null;
  recordedAt: string;
  geom: GeoJSONPoint | null;
  districtId: string;
  districtName?: string;
}

export type CreateWaterQualityDTO = Omit<WaterQuality, 'id' | 'geom' | 'districtName'> & { geom: string };

export type UpdateWaterQualityDTO = Partial<CreateWaterQualityDTO>;

export interface FindWaterQualitiesQuery {
  districtId?: string;
  from?: string;
  to?: string;
}

export interface FindWithinRadiusQuery {
  lng: number;
  lat: number;
  radiusInMeters: number;
}

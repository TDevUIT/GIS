import type { GeoJSONPoint } from './shared';

export interface WaterQuality {
  id: string;
  ph: number | null;
  turbidity: number | null;
  contaminationIndex: number | null;
  recordedAt: string;
  geom: GeoJSONPoint;
  districtId: string;
}

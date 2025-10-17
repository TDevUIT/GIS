import { TransportMode } from './shared';
import type { GeoJSONLineString } from './shared';

export interface PublicTransport {
  id: string;
  routeName: string;
  mode: TransportMode;
  capacity: number | null;
  stopsCount: number | null;
  frequencyMin: number | null;
  operatingHours: string | null;
  createdAt: string;
  updatedAt: string;
  geom: GeoJSONLineString | null;
  districtId: string;
  districtName?: string;
}

export type CreatePublicTransportDTO = Omit<
  PublicTransport,
  'id' | 'createdAt' | 'updatedAt' | 'geom' | 'districtName'
> & { geom: string };

export type UpdatePublicTransportDTO = Partial<CreatePublicTransportDTO>;

export interface FindPublicTransportsQuery {
  districtId?: string;
  mode?: TransportMode;
}

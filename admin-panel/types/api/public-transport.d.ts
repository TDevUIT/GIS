import type { GeoJSONLineString, TransportMode } from './shared';

export interface PublicTransport {
  id: string;
  routeName: string;
  mode: TransportMode;
  capacity: number | null;
  geom: GeoJSONLineString | null;
  districtId: string;
  districtName?: string;
}

export type CreatePublicTransportDTO = Omit<PublicTransport, 'id' | 'geom' | 'districtName'> & { geom: string };

export type UpdatePublicTransportDTO = Partial<CreatePublicTransportDTO>;

export interface FindPublicTransportsQuery {
  districtId?: string;
  mode?: TransportMode;
}

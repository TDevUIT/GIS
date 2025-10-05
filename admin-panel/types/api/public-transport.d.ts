import type { GeoJSONLineString } from './shared';
import type { TransportMode } from './shared';

export interface PublicTransport {
  id: string;
  routeName: string;
  mode: TransportMode;
  capacity: number | null;
  geom: GeoJSONLineString;
  districtId: string;
}

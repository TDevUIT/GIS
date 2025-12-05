/**
 * Public Transport Query Interface
 * Query parameters for public transport service
 */

export type PublicTransportMode = 'BUS' | 'METRO' | 'BRT' | 'WATERWAY';

export interface PublicTransportQuery {
  districtId?: string;
  mode?: PublicTransportMode;
}

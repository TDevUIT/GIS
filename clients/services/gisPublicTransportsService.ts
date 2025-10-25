import { gisApiGet, gisApiPost, GisApiResponse } from './common/gisApi';

type TransportMode = 'BUS' | 'METRO' | 'BRT' | 'WATERWAY';

interface PublicTransportQuery {
  districtId?: string;
  mode?: TransportMode;
}

// GET all public transport routes (GIS Server)
export const getAllPublicTransportsGIS = async (query?: PublicTransportQuery): Promise<GisApiResponse> => {
  const params = new URLSearchParams();
  if (query?.districtId) params.append('districtId', query.districtId);
  if (query?.mode) params.append('mode', query.mode);

  const queryString = params.toString();
  return gisApiGet(`/public-transports${queryString ? `?${queryString}` : ''}`);
};

// POST find intersecting public transport routes (GIS Server)
export const findIntersectingPublicTransportsGIS = async (wkt: string): Promise<GisApiResponse> => {
  return gisApiPost('/public-transports/intersects-with', { wkt });
};

// GET public transport route by ID (GIS Server)
export const getPublicTransportByIdGIS = async (id: string): Promise<GisApiResponse> => {
  return gisApiGet(`/public-transports/${id}`);
};

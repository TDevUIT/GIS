import { gisApiGet, gisApiPost, GisApiResponse } from './common/gisApi';

interface TrafficQuery {
  districtId?: string;
  roadName?: string;
}

// GET all traffic records (GIS Server)
export const getAllTrafficsGIS = async (query?: TrafficQuery): Promise<GisApiResponse> => {
  const params = new URLSearchParams();
  if (query?.districtId) params.append('districtId', query.districtId);
  if (query?.roadName) params.append('roadName', query.roadName);

  const queryString = params.toString();
  return gisApiGet(`/traffics${queryString ? `?${queryString}` : ''}`);
};

// POST find intersecting traffic records (GIS Server)
export const findIntersectingTrafficsGIS = async (wkt: string): Promise<GisApiResponse> => {
  return gisApiPost('/traffics/intersects-with', { wkt });
};

// GET traffic record by ID (GIS Server)
export const getTrafficByIdGIS = async (id: string): Promise<GisApiResponse> => {
  return gisApiGet(`/traffics/${id}`);
};

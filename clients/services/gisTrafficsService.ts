import { gisApiGet, gisApiPost, ApiResponse } from './common/gisApi';

interface TrafficQuery {
  districtId?: string;
  roadName?: string;
}

// GET all traffic records (GIS Server)
export const getAllTrafficsGIS = async (query?: TrafficQuery): Promise<ApiResponse> => {
  const params = new URLSearchParams();
  if (query?.districtId) params.append('districtId', query.districtId);
  if (query?.roadName) params.append('roadName', query.roadName);

  const queryString = params.toString();
  return gisApiGet(`/traffics${queryString ? `?${queryString}` : ''}`);
};

// POST find intersecting traffic records (GIS Server)
export const findIntersectingTrafficsGIS = async (wkt: string): Promise<ApiResponse> => {
  return gisApiPost('/traffics/intersects-with', { wkt });
};

// GET traffic record by ID (GIS Server)
export const getTrafficByIdGIS = async (id: string): Promise<ApiResponse> => {
  return gisApiGet(`/traffics/${id}`);
};

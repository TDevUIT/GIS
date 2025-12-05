import { apiGet, apiPost, ApiResponse } from '../common/api';
import type { TrafficQuery } from '@/interfaces/query/traffic';


// GET all traffic data
export const getAllTraffics = async (query?: TrafficQuery): Promise<ApiResponse> => {
  const params = new URLSearchParams();
  if (query?.districtId) params.append('districtId', query.districtId);
  if (query?.roadName) params.append('roadName', query.roadName);

  const queryString = params.toString();
  return apiGet(`/traffics${queryString ? `?${queryString}` : ''}`);
};

// POST find intersecting traffic data
export const findIntersectingTraffics = async (wkt: string): Promise<ApiResponse> => {
  return apiPost('/traffics/intersects-with', { wkt });
};

// GET traffic by ID
export const getTrafficById = async (id: string): Promise<ApiResponse> => {
  return apiGet(`/traffics/${id}`);
};



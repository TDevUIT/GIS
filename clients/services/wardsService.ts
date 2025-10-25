import { apiGet, apiPost, ApiResponse } from './common/api';

// GET all wards
export const getAllWards = async (districtId?: string): Promise<ApiResponse> => {
  const params = districtId ? `?districtId=${districtId}` : '';
  return apiGet(`/wards${params}`);
};

// GET ward by ID
export const getWardById = async (id: string): Promise<ApiResponse> => {
  return apiGet(`/wards/${id}`);
};

// GET ward containing point
export const getWardContainingPoint = async (lng: number, lat: number): Promise<ApiResponse> => {
  return apiGet(`/wards/contains-point?lng=${lng}&lat=${lat}`);
};

// POST find intersecting wards
export const findIntersectingWards = async (wkt: string): Promise<ApiResponse> => {
  return apiPost('/wards/intersects-with', { wkt });
};

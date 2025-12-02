import { apiGet, apiPost, ApiResponse } from '../common/api';

// GET all terrains
export const getAllTerrains = async (districtId?: string): Promise<ApiResponse> => {
  const params = districtId ? `?districtId=${districtId}` : '';
  return apiGet(`/terrains${params}`);
};

// GET terrain at point
export const getTerrainAtPoint = async (lng: number, lat: number): Promise<ApiResponse> => {
  return apiGet(`/terrains/at-point?lng=${lng}&lat=${lat}`);
};

// POST find intersecting terrains
export const findIntersectingTerrains = async (wkt: string): Promise<ApiResponse> => {
  return apiPost('/terrains/intersects-with', { wkt });
};

// GET terrain by ID
export const getTerrainById = async (id: string): Promise<ApiResponse> => {
  return apiGet(`/terrains/${id}`);
};



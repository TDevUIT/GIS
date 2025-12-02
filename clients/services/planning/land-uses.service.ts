import { apiGet, apiPost, ApiResponse } from '../common/api';

interface LandUseQuery {
  districtId?: string;
  type?: string;
}

// GET all land use records
export const getAllLandUses = async (query?: LandUseQuery): Promise<ApiResponse> => {
  const params = new URLSearchParams();
  if (query?.districtId) params.append('districtId', query.districtId);
  if (query?.type) params.append('type', query.type);

  const queryString = params.toString();
  return apiGet(`/land-uses${queryString ? `?${queryString}` : ''}`);
};

// GET land use at point
export const getLandUseAtPoint = async (lng: number, lat: number): Promise<ApiResponse> => {
  return apiGet(`/land-uses/at-point?lng=${lng}&lat=${lat}`);
};

// POST find intersecting land uses
export const findIntersectingLandUses = async (wkt: string): Promise<ApiResponse> => {
  return apiPost('/land-uses/intersects-with', { wkt });
};

// GET land use by ID
export const getLandUseById = async (id: string): Promise<ApiResponse> => {
  return apiGet(`/land-uses/${id}`);
};



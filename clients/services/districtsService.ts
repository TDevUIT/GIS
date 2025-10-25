import { apiGet, apiPost, ApiResponse } from './common/api';

// GET all districts
export const getAllDistricts = async (): Promise<ApiResponse> => {
  return apiGet('/districts');
};

// GET district by ID
export const getDistrictById = async (id: string): Promise<ApiResponse> => {
  return apiGet(`/districts/${id}`);
};

// GET district containing point
export const getDistrictContainingPoint = async (lng: number, lat: number): Promise<ApiResponse> => {
  return apiGet(`/districts/contains-point?lng=${lng}&lat=${lat}`);
};

// POST find intersecting districts
export const findIntersectingDistricts = async (wkt: string): Promise<ApiResponse> => {
  return apiPost('/districts/intersects-with', { wkt });
};

// GET wards of a district
export const getWardsOfDistrict = async (districtId: string): Promise<ApiResponse> => {
  return apiGet(`/districts/${districtId}/wards`);
};

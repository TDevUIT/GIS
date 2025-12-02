import { apiGet, apiPost, apiPut, apiDelete, ApiResponse } from '../common/api';

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

// POST create district
export const createDistrict = async (data: any): Promise<ApiResponse> => {
  return apiPost('/districts', data);
};

// PUT update district
export const updateDistrict = async (id: string, data: any): Promise<ApiResponse> => {
  return apiPut(`/districts/${id}`, data);
};

// DELETE district
export const deleteDistrict = async (id: string): Promise<ApiResponse> => {
  return apiDelete(`/districts/${id}`);
};



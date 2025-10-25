import { gisApiGet, gisApiPost, ApiResponse } from './common/gisApi';

// GET all districts (GIS Server)
export const getAllDistrictsGIS = async (): Promise<ApiResponse> => {
  return gisApiGet('/districts');
};

// GET district by ID (GIS Server)
export const getDistrictByIdGIS = async (id: string): Promise<ApiResponse> => {
  return gisApiGet(`/districts/${id}`);
};

// GET district containing point (GIS Server)
export const getDistrictContainingPointGIS = async (lng: number, lat: number): Promise<ApiResponse> => {
  return gisApiGet(`/districts/contains-point?lng=${lng}&lat=${lat}`);
};

// POST find intersecting districts (GIS Server)
export const findIntersectingDistrictsGIS = async (wkt: string): Promise<ApiResponse> => {
  return gisApiPost('/districts/intersects-with', { wkt });
};

// GET wards of a district (GIS Server)
export const getWardsOfDistrictGIS = async (districtId: string): Promise<ApiResponse> => {
  return gisApiGet(`/districts/${districtId}/wards`);
};

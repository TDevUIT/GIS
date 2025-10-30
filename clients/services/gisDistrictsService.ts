import { gisApiGet, gisApiPost, GisApiResponse } from './common/gisApi';

// GET all districts (GIS Server)
export const getAllDistrictsGIS = async (): Promise<GisApiResponse> => {
  return gisApiGet('/districts');
};

// GET district by ID (GIS Server)
export const getDistrictByIdGIS = async (id: string): Promise<GisApiResponse> => {
  return gisApiGet(`/districts/${id}`);
};

// GET district containing point (GIS Server)
export const getDistrictContainingPointGIS = async (lng: number, lat: number): Promise<GisApiResponse> => {
  return gisApiGet(`/districts/contains-point?lng=${lng}&lat=${lat}`);
};

// POST find intersecting districts (GIS Server)
export const findIntersectingDistrictsGIS = async (wkt: string): Promise<GisApiResponse> => {
  return gisApiPost('/districts/intersects-with', { wkt });
};

// GET wards of a district (GIS Server)
export const getWardsOfDistrictGIS = async (districtId: string): Promise<GisApiResponse> => {
  return gisApiGet(`/districts/${districtId}/wards`);
};

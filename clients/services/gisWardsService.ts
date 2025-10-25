import { gisApiGet, gisApiPost, GisApiResponse } from './common/gisApi';

// GET all wards (GIS Server)
export const getAllWardsGIS = async (districtId?: string): Promise<GisApiResponse> => {
  const params = districtId ? `?districtId=${districtId}` : '';
  return gisApiGet(`/wards${params}`);
};

// GET ward by ID (GIS Server)
export const getWardByIdGIS = async (id: string): Promise<GisApiResponse> => {
  return gisApiGet(`/wards/${id}`);
};

// GET ward containing point (GIS Server)
export const getWardContainingPointGIS = async (lng: number, lat: number): Promise<GisApiResponse> => {
  return gisApiGet(`/wards/contains-point?lng=${lng}&lat=${lat}`);
};

// POST find intersecting wards (GIS Server)
export const findIntersectingWardsGIS = async (wkt: string): Promise<GisApiResponse> => {
  return gisApiPost('/wards/intersects-with', { wkt });
};

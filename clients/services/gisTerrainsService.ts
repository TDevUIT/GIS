import { gisApiGet, gisApiPost, ApiResponse } from './common/gisApi';

// GET all terrains (GIS Server)
export const getAllTerrainsGIS = async (districtId?: string): Promise<ApiResponse> => {
  const params = districtId ? `?districtId=${districtId}` : '';
  return gisApiGet(`/terrains${params}`);
};

// GET terrain at point (GIS Server)
export const getTerrainAtPointGIS = async (lng: number, lat: number): Promise<ApiResponse> => {
  return gisApiGet(`/terrains/at-point?lng=${lng}&lat=${lat}`);
};

// POST find intersecting terrains (GIS Server)
export const findIntersectingTerrainsGIS = async (wkt: string): Promise<ApiResponse> => {
  return gisApiPost('/terrains/intersects-with', { wkt });
};

// GET terrain by ID (GIS Server)
export const getTerrainByIdGIS = async (id: string): Promise<ApiResponse> => {
  return gisApiGet(`/terrains/${id}`);
};

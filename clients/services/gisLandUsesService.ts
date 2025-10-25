import { gisApiGet, gisApiPost, ApiResponse } from './common/gisApi';

interface LandUseQuery {
  districtId?: string;
  type?: string;
}

// GET all land use records (GIS Server)
export const getAllLandUsesGIS = async (query?: LandUseQuery): Promise<ApiResponse> => {
  const params = new URLSearchParams();
  if (query?.districtId) params.append('districtId', query.districtId);
  if (query?.type) params.append('type', query.type);

  const queryString = params.toString();
  return gisApiGet(`/land-uses${queryString ? `?${queryString}` : ''}`);
};

// GET land use at point (GIS Server)
export const getLandUseAtPointGIS = async (lng: number, lat: number): Promise<ApiResponse> => {
  return gisApiGet(`/land-uses/at-point?lng=${lng}&lat=${lat}`);
};

// POST find intersecting land uses (GIS Server)
export const findIntersectingLandUsesGIS = async (wkt: string): Promise<ApiResponse> => {
  return gisApiPost('/land-uses/intersects-with', { wkt });
};

// GET land use by ID (GIS Server)
export const getLandUseByIdGIS = async (id: string): Promise<ApiResponse> => {
  return gisApiGet(`/land-uses/${id}`);
};

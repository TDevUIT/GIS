import { gisApiGet, GisApiResponse } from './common/gisApi';

export type InfraCategory = 'SCHOOL' | 'HOSPITAL' | 'PARK' | 'MARKET' | 'UTILITY' | 'ADMINISTRATIVE' | 'OTHER';

// GET all infrastructures (GIS Server)
export const getAllInfrastructuresGIS = async (
  districtId?: string,
  category?: InfraCategory
): Promise<GisApiResponse> => {
  const params = new URLSearchParams();
  if (districtId) params.append('districtId', districtId);
  if (category) params.append('category', category);

  const queryString = params.toString();
  return gisApiGet(`/infrastructures${queryString ? `?${queryString}` : ''}`);
};

// GET infrastructures within radius (GIS Server)
export const getInfrastructuresWithinRadiusGIS = async (
  lng: number,
  lat: number,
  radiusInMeters: number
): Promise<GisApiResponse> => {
  return gisApiGet(`/infrastructures/within-radius?lng=${lng}&lat=${lat}&radiusInMeters=${radiusInMeters}`);
};

// GET infrastructure by ID (GIS Server)
export const getInfrastructureByIdGIS = async (id: string): Promise<GisApiResponse> => {
  return gisApiGet(`/infrastructures/${id}`);
};

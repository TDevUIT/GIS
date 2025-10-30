import { apiGet, ApiResponse } from './common/api';

type InfraCategory = 'SCHOOL' | 'HOSPITAL' | 'PARK' | 'MARKET' | 'UTILITY' | 'ADMINISTRATIVE' | 'OTHER';

// GET all infrastructures
export const getAllInfrastructures = async (
  districtId?: string,
  category?: InfraCategory
): Promise<ApiResponse> => {
  const params = new URLSearchParams();
  if (districtId) params.append('districtId', districtId);
  if (category) params.append('category', category);

  const queryString = params.toString();
  return apiGet(`/infrastructures${queryString ? `?${queryString}` : ''}`);
};

// GET infrastructures within radius
export const getInfrastructuresWithinRadius = async (
  lng: number,
  lat: number,
  radiusInMeters: number
): Promise<ApiResponse> => {
  return apiGet(`/infrastructures/within-radius?lng=${lng}&lat=${lat}&radiusInMeters=${radiusInMeters}`);
};

// GET infrastructure by ID
export const getInfrastructureById = async (id: string): Promise<ApiResponse> => {
  return apiGet(`/infrastructures/${id}`);
};

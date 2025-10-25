import { apiGet, ApiResponse } from './common/api';

// GET all population records
export const getAllPopulations = async (districtId?: string, year?: number): Promise<ApiResponse> => {
  const params = new URLSearchParams();
  if (districtId) params.append('districtId', districtId);
  if (year) params.append('year', year.toString());

  const queryString = params.toString();
  return apiGet(`/populations${queryString ? `?${queryString}` : ''}`);
};

// GET population by ID
export const getPopulationById = async (id: string): Promise<ApiResponse> => {
  return apiGet(`/populations/${id}`);
};

import { gisApiGet, ApiResponse } from './common/gisApi';

// GET all population records (GIS Server)
export const getAllPopulationsGIS = async (districtId?: string, year?: number): Promise<ApiResponse> => {
  const params = new URLSearchParams();
  if (districtId) params.append('districtId', districtId);
  if (year) params.append('year', year.toString());

  const queryString = params.toString();
  return gisApiGet(`/populations${queryString ? `?${queryString}` : ''}`);
};

// GET population by ID (GIS Server)
export const getPopulationByIdGIS = async (id: string): Promise<ApiResponse> => {
  return gisApiGet(`/populations/${id}`);
};

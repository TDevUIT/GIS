import { gisApiGet, ApiResponse } from './common/gisApi';

// GET all accidents (GIS Server)
export const getAllAccidentsGIS = async (): Promise<ApiResponse> => {
  return gisApiGet('/accidents');
};

// GET accident by ID (GIS Server)
export const getAccidentByIdGIS = async (id: string): Promise<ApiResponse> => {
  return gisApiGet(`/accidents/${id}`);
};

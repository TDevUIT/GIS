import { apiGet, ApiResponse } from './common/api';

// GET all accidents
export const getAllAccidents = async (): Promise<ApiResponse> => {
  return apiGet('/accidents');
};

// GET accident by ID
export const getAccidentById = async (id: string): Promise<ApiResponse> => {
  return apiGet(`/accidents/${id}`);
};

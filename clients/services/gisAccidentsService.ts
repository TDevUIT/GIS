import { gisApiGet, GisApiResponse } from './common/gisApi';

// GET all accidents (GIS Server)
export const getAllAccidentsGIS = async (): Promise<GisApiResponse> => {
  return gisApiGet('/accidents');
};

// GET accident by ID (GIS Server)
export const getAccidentByIdGIS = async (id: string): Promise<GisApiResponse> => {
  return gisApiGet(`/accidents/${id}`);
};

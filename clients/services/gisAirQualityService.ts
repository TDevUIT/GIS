import { gisApiGet, GisApiResponse } from './common/gisApi';

export const getAllAirQualitiesGIS = async (): Promise<GisApiResponse> => {
  return gisApiGet('/air-qualities');
};

export const getAirQualityByIdGIS = async (id: string): Promise<GisApiResponse> => {
  return gisApiGet(`/air-qualities/${id}`);
};

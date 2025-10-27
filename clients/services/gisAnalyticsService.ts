import { gisApiGet, GisApiResponse } from './common/gisApi';

// GET summary statistics (GIS Server)
export const getSummaryGIS = async (): Promise<GisApiResponse> => {
  return gisApiGet('/analytics/summary');
};

// GET accident statistics (GIS Server)
export const getAccidentStatsGIS = async (): Promise<GisApiResponse> => {
  return gisApiGet('/analytics/accidents');
};

// GET traffic statistics (GIS Server)
export const getTrafficStatsGIS = async (): Promise<GisApiResponse> => {
  return gisApiGet('/analytics/traffic');
};

// GET environmental statistics (GIS Server)
export const getEnvironmentalStatsGIS = async (): Promise<GisApiResponse> => {
  return gisApiGet('/analytics/environmental');
};

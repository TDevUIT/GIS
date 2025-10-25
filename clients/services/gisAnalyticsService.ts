import { gisApiGet, ApiResponse } from './common/gisApi';

// GET summary statistics (GIS Server)
export const getSummaryGIS = async (): Promise<ApiResponse> => {
  return gisApiGet('/analytics/summary');
};

// GET accident statistics (GIS Server)
export const getAccidentStatsGIS = async (): Promise<ApiResponse> => {
  return gisApiGet('/analytics/accidents');
};

// GET traffic statistics (GIS Server)
export const getTrafficStatsGIS = async (): Promise<ApiResponse> => {
  return gisApiGet('/analytics/traffic');
};

// GET environmental statistics (GIS Server)
export const getEnvironmentalStatsGIS = async (): Promise<ApiResponse> => {
  return gisApiGet('/analytics/environmental');
};

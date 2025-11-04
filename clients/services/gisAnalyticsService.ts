import { gisApiGet, GisApiResponse } from './common/gisApi';

// GET summary statistics (GIS Server)
export const getSummaryGIS = async (): Promise<GisApiResponse> => {
  return gisApiGet('/analytics/summary');
};

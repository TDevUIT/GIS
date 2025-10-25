import { gisApiGet, GisApiResponse } from './common/gisApi';

interface AirQualityQuery {
  districtId?: string;
  from?: string;
  to?: string;
}

// GET all air quality records (GIS Server)
export const getAllAirQualitiesGIS = async (query?: AirQualityQuery): Promise<GisApiResponse> => {
  const params = new URLSearchParams();
  if (query?.districtId) params.append('districtId', query.districtId);
  if (query?.from) params.append('from', query.from);
  if (query?.to) params.append('to', query.to);

  const queryString = params.toString();
  return gisApiGet(`/air-qualities${queryString ? `?${queryString}` : ''}`);
};

// GET air quality by ID (GIS Server)
export const getAirQualityByIdGIS = async (id: string): Promise<GisApiResponse> => {
  return gisApiGet(`/air-qualities/${id}`);
};

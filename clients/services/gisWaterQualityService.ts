import { gisApiGet, GisApiResponse } from './common/gisApi';

interface WaterQualityQuery {
  districtId?: string;
  from?: string;
  to?: string;
}

export const getAllWaterQualitiesGIS = async (query?: WaterQualityQuery): Promise<GisApiResponse> => {
  const params = new URLSearchParams();
  if (query?.districtId) params.append('districtId', query.districtId);
  if (query?.from) params.append('from', query.from);
  if (query?.to) params.append('to', query.to);

  const queryString = params.toString();
  return gisApiGet(`/water-qualities${queryString ? `?${queryString}` : ''}`);
};

export const getWaterQualityByIdGIS = async (id: string): Promise<GisApiResponse> => {
  return gisApiGet(`/water-qualities/${id}`);
};

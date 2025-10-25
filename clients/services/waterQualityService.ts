import { apiGet, ApiResponse } from './common/api';

interface WaterQualityQuery {
  districtId?: string;
  from?: string;
  to?: string;
}

// GET all water quality records
export const getAllWaterQualities = async (query?: WaterQualityQuery): Promise<ApiResponse> => {
  const params = new URLSearchParams();
  if (query?.districtId) params.append('districtId', query.districtId);
  if (query?.from) params.append('from', query.from);
  if (query?.to) params.append('to', query.to);

  const queryString = params.toString();
  return apiGet(`/water-qualities${queryString ? `?${queryString}` : ''}`);
};

// GET water quality within radius
export const getWaterQualityWithinRadius = async (
  lng: number,
  lat: number,
  radiusInMeters: number
): Promise<ApiResponse> => {
  return apiGet(`/water-qualities/within-radius?lng=${lng}&lat=${lat}&radiusInMeters=${radiusInMeters}`);
};

// GET water quality by ID
export const getWaterQualityById = async (id: string): Promise<ApiResponse> => {
  return apiGet(`/water-qualities/${id}`);
};

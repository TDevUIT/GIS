import { apiGet, ApiResponse } from '../common/api';

interface AirQualityQuery {
  districtId?: string;
  from?: string;
  to?: string;
}

// GET all air quality records
export const getAllAirQualities = async (query?: AirQualityQuery): Promise<ApiResponse> => {
  const params = new URLSearchParams();
  if (query?.districtId) params.append('districtId', query.districtId);
  if (query?.from) params.append('from', query.from);
  if (query?.to) params.append('to', query.to);

  const queryString = params.toString();
  return apiGet(`/air-qualities${queryString ? `?${queryString}` : ''}`);
};

// GET air quality within radius
export const getAirQualityWithinRadius = async (
  lng: number,
  lat: number,
  radiusInMeters: number
): Promise<ApiResponse> => {
  return apiGet(`/air-qualities/within-radius?lng=${lng}&lat=${lat}&radiusInMeters=${radiusInMeters}`);
};

// GET air quality by ID
export const getAirQualityById = async (id: string): Promise<ApiResponse> => {
  return apiGet(`/air-qualities/${id}`);
};



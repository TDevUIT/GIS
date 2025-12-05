import { apiGet, apiPost, ApiResponse } from '../common/api';
import type { PublicTransportMode, PublicTransportQuery } from '@/interfaces/query/public-transport';


// GET all public transport routes
export const getAllPublicTransports = async (query?: PublicTransportQuery): Promise<ApiResponse> => {
  const params = new URLSearchParams();
  if (query?.districtId) params.append('districtId', query.districtId);
  if (query?.mode) params.append('mode', query.mode);

  const queryString = params.toString();
  return apiGet(`/public-transports${queryString ? `?${queryString}` : ''}`);
};

// POST find intersecting public transport routes
export const findIntersectingPublicTransports = async (wkt: string): Promise<ApiResponse> => {
  return apiPost('/public-transports/intersects-with', { wkt });
};

// GET public transport route by ID
export const getPublicTransportById = async (id: string): Promise<ApiResponse> => {
  return apiGet(`/public-transports/${id}`);
};


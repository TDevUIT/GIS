import { apiGet, apiPost, ApiResponse } from './common/api';

interface UrbanPlanQuery {
  districtId?: string;
  zoningType?: string;
}

// GET all urban plans
export const getAllUrbanPlans = async (query?: UrbanPlanQuery): Promise<ApiResponse> => {
  const params = new URLSearchParams();
  if (query?.districtId) params.append('districtId', query.districtId);
  if (query?.zoningType) params.append('zoningType', query.zoningType);

  const queryString = params.toString();
  return apiGet(`/urban-plans${queryString ? `?${queryString}` : ''}`);
};

// GET urban plan at point
export const getUrbanPlanAtPoint = async (lng: number, lat: number): Promise<ApiResponse> => {
  return apiGet(`/urban-plans/at-point?lng=${lng}&lat=${lat}`);
};

// POST find intersecting urban plans
export const findIntersectingUrbanPlans = async (wkt: string): Promise<ApiResponse> => {
  return apiPost('/urban-plans/intersects-with', { wkt });
};

// GET urban plan by ID
export const getUrbanPlanById = async (id: string): Promise<ApiResponse> => {
  return apiGet(`/urban-plans/${id}`);
};

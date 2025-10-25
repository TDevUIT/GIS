import { gisApiGet, gisApiPost, GisApiResponse } from './common/gisApi';

interface UrbanPlanQuery {
  districtId?: string;
  zoningType?: string;
}

// GET all urban plans (GIS Server)
export const getAllUrbanPlansGIS = async (query?: UrbanPlanQuery): Promise<GisApiResponse> => {
  const params = new URLSearchParams();
  if (query?.districtId) params.append('districtId', query.districtId);
  if (query?.zoningType) params.append('zoningType', query.zoningType);

  const queryString = params.toString();
  return gisApiGet(`/urban-plans${queryString ? `?${queryString}` : ''}`);
};

// GET urban plan at point (GIS Server)
export const getUrbanPlanAtPointGIS = async (lng: number, lat: number): Promise<GisApiResponse> => {
  return gisApiGet(`/urban-plans/at-point?lng=${lng}&lat=${lat}`);
};

// POST find intersecting urban plans (GIS Server)
export const findIntersectingUrbanPlansGIS = async (wkt: string): Promise<GisApiResponse> => {
  return gisApiPost('/urban-plans/intersects-with', { wkt });
};

// GET urban plan by ID (GIS Server)
export const getUrbanPlanByIdGIS = async (id: string): Promise<GisApiResponse> => {
  return gisApiGet(`/urban-plans/${id}`);
};

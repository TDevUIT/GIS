import { apiGet, ApiResponse } from '../common/api';

export const getDistricts = async (): Promise<ApiResponse<any[]>> => {
  return apiGet<any[]>('/districts');
};

export const getWards = async (districtId: string): Promise<ApiResponse<any[]>> => {
  return apiGet<any[]>(`/districts/${districtId}/wards`);
};

export const getMapLayers = async (): Promise<ApiResponse<any[]>> => {
  return apiGet('/gis/layers');
};

export const getLocationData = async (lat: number, lng: number): Promise<ApiResponse<any>> => {
  return apiGet<any>(`/gis/location?lat=${lat}&lng=${lng}`);
};

export const searchLocations = async (query: string): Promise<ApiResponse<any[]>> => {
  return apiGet<any[]>(`/gis/search?q=${encodeURIComponent(query)}`);
};


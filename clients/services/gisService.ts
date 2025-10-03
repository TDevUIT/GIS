import { apiGet, ApiResponse } from './api';
import { District, Ward, Location } from '../types';

export const getDistricts = async (): Promise<ApiResponse<District[]>> => {
  return apiGet<District[]>('/districts');
};

export const getWards = async (districtId: string): Promise<ApiResponse<Ward[]>> => {
  return apiGet<Ward[]>(`/districts/${districtId}/wards`);
};

export const getMapLayers = async (): Promise<ApiResponse<any[]>> => {
  return apiGet('/gis/layers');
};

export const getLocationData = async (lat: number, lng: number): Promise<ApiResponse<Location>> => {
  return apiGet<Location>(`/gis/location?lat=${lat}&lng=${lng}`);
};

export const searchLocations = async (query: string): Promise<ApiResponse<Location[]>> => {
  return apiGet<Location[]>(`/gis/search?q=${encodeURIComponent(query)}`);
};

import { apiGet, ApiResponse } from './api';
import { AirQualityData } from '../types';

export const getAirQualityData = async (districtId?: string): Promise<ApiResponse<AirQualityData[]>> => {
  return apiGet<AirQualityData[]>(`/air-quality${districtId ? `?district=${districtId}` : ''}`);
};

export const getAirQualityHistory = async (dateRange: string): Promise<ApiResponse<AirQualityData[]>> => {
  return apiGet<AirQualityData[]>(`/air-quality/history?range=${dateRange}`);
};

export const getAirQualityAlerts = async (): Promise<ApiResponse<any[]>> => {
  return apiGet('/air-quality/alerts');
};

export const getAirQualityForecast = async (days: number = 7): Promise<ApiResponse<any[]>> => {
  return apiGet(`/air-quality/forecast?days=${days}`);
};

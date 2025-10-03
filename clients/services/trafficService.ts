import { apiGet, apiPost, ApiResponse } from './api';
import { TrafficData, Incident } from '../types';

export const getTrafficData = async (districtId?: string): Promise<ApiResponse<TrafficData[]>> => {
  return apiGet<TrafficData[]>(`/traffic${districtId ? `?district=${districtId}` : ''}`);
};

export const getTrafficIncidents = async (): Promise<ApiResponse<Incident[]>> => {
  return apiGet<Incident[]>('/traffic/incidents');
};

export const reportTrafficIncident = async (incident: Partial<Incident>): Promise<ApiResponse<Incident>> => {
  return apiPost<Incident>('/traffic/incidents', incident);
};

export const getTrafficAnalytics = async (dateRange: string): Promise<ApiResponse<any>> => {
  return apiGet(`/traffic/analytics?range=${dateRange}`);
};

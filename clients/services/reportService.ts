import { apiGet, apiPost, apiDelete, ApiResponse } from './common/api';
import { Report } from '../types';

export const getReports = async (type?: string): Promise<ApiResponse<Report[]>> => {
  return apiGet<Report[]>(`/reports${type ? `?type=${type}` : ''}`);
};

export const generateReport = async (reportConfig: any): Promise<ApiResponse<Report>> => {
  return apiPost<Report>('/reports/generate', reportConfig);
};

export const downloadReport = async (reportId: string): Promise<ApiResponse<Blob>> => {
  return apiGet<Blob>(`/reports/${reportId}/download`);
};

export const getReportStatus = async (reportId: string): Promise<ApiResponse<any>> => {
  return apiGet(`/reports/${reportId}/status`);
};

export const deleteReport = async (reportId: string): Promise<ApiResponse<void>> => {
  return apiDelete<void>(`/reports/${reportId}`);
};

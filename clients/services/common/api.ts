import apiClient from '@/config/axios';
import { AxiosResponse } from 'axios';
import type { ApiResponse } from '@/interfaces/api';

// Re-export ApiResponse from centralized interfaces
export type { ApiResponse } from '@/interfaces/api';


const handleError = (error: any): Error => {
  if (error.response) {
    const message = error.response.data?.message || error.response.statusText || 'Server Error';
    return new Error(`API Error (${error.response.status}): ${message}`);
  } else if (error.request) {
    return new Error('Network Error: No response from server');
  } else {
    return new Error(`Request Error: ${error.message}`);
  }
};

export const apiGet = async <T = any>(endpoint: string): Promise<ApiResponse<T>> => {
  try {
    const response: AxiosResponse<any> = await apiClient.get(endpoint);

    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const apiPost = async <T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> => {
  try {
    const response: AxiosResponse<any> = await apiClient.post(endpoint, data);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const apiPut = async <T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> => {
  try {
    const response: AxiosResponse<any> = await apiClient.put(endpoint, data);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const apiDelete = async <T = any>(endpoint: string): Promise<ApiResponse<T>> => {
  try {
    const response: AxiosResponse<any> = await apiClient.delete(endpoint);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const apiPatch = async <T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> => {
  try {
    const response: AxiosResponse<any> = await apiClient.patch(endpoint, data);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

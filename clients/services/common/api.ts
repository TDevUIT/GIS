import apiClient from '@/config/axios';
import { AxiosResponse } from 'axios';

export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  status: number;
}

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
    // Check if server returns nested structure: { data: { data: [...] } }
    if (response.data?.data && typeof response.data.data === 'object') {
      return response.data.data;
    }
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const apiPost = async <T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> => {
  try {
    const response: AxiosResponse<any> = await apiClient.post(endpoint, data);
    // Check if server returns nested structure: { data: { data: [...] } }
    if (response.data?.data && typeof response.data.data === 'object') {
      return response.data.data;
    }
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const apiPut = async <T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> => {
  try {
    const response: AxiosResponse<any> = await apiClient.put(endpoint, data);
    // Check if server returns nested structure: { data: { data: [...] } }
    if (response.data?.data && typeof response.data.data === 'object') {
      return response.data.data;
    }
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const apiDelete = async <T = any>(endpoint: string): Promise<ApiResponse<T>> => {
  try {
    const response: AxiosResponse<any> = await apiClient.delete(endpoint);
    // Check if server returns nested structure: { data: { data: [...] } }
    if (response.data?.data && typeof response.data.data === 'object') {
      return response.data.data;
    }
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const apiPatch = async <T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> => {
  try {
    const response: AxiosResponse<any> = await apiClient.patch(endpoint, data);
    // Check if server returns nested structure: { data: { data: [...] } }
    if (response.data?.data && typeof response.data.data === 'object') {
      return response.data.data;
    }
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

import { AxiosResponse } from 'axios';
import { gisApiClient } from '../../config/gisAxios';

export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  status: number;
}

const handleError = (error: any): Error => {
  if (error.response) {
    const message = error.response.data?.message || error.response.statusText || 'Server Error';
    return new Error(`GIS API Error (${error.response.status}): ${message}`);
  } else if (error.request) {
    return new Error('Network Error: No response from GIS server');
  } else {
    return new Error(`Request Error: ${error.message}`);
  }
};

export const gisApiGet = async <T = any>(endpoint: string): Promise<ApiResponse<T>> => {
  try {
    const response: AxiosResponse<ApiResponse<T>> = await gisApiClient.get(endpoint);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const gisApiPost = async <T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> => {
  try {
    const response: AxiosResponse<ApiResponse<T>> = await gisApiClient.post(endpoint, data);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const gisApiPut = async <T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> => {
  try {
    const response: AxiosResponse<ApiResponse<T>> = await gisApiClient.put(endpoint, data);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const gisApiDelete = async <T = any>(endpoint: string): Promise<ApiResponse<T>> => {
  try {
    const response: AxiosResponse<ApiResponse<T>> = await gisApiClient.delete(endpoint);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const gisApiPatch = async <T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> => {
  try {
    const response: AxiosResponse<ApiResponse<T>> = await gisApiClient.patch(endpoint, data);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

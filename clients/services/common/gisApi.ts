import { AxiosResponse } from 'axios';
import { gisApiClient } from '../../config/gisAxios';

export interface GisApiResponse<T = any> {
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

export const gisApiGet = async <T = any>(endpoint: string): Promise<GisApiResponse<T>> => {
  try {
    const response: AxiosResponse<any> = await gisApiClient.get(endpoint);
    // GIS Server returns nested structure: { data: { data: { data: {...} } } }
    // Unwrap twice to get the actual data with geom
    if (response.data?.data?.data) {
      return {
        data: response.data.data.data,
        message: response.data.data.message || response.data.message,
        status: response.status,
      };
    }
    // Fallback for single-nested structure
    if (response.data?.data) {
      return {
        data: response.data.data,
        message: response.data.message,
        status: response.status,
      };
    }
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const gisApiPost = async <T = any>(endpoint: string, data?: any): Promise<GisApiResponse<T>> => {
  try {
    const response: AxiosResponse<any> = await gisApiClient.post(endpoint, data);
    // GIS Server returns nested structure: { data: { data: { data: {...} } } }
    if (response.data?.data?.data) {
      return {
        data: response.data.data.data,
        message: response.data.data.message || response.data.message,
        status: response.status,
      };
    }
    // Fallback for single-nested structure
    if (response.data?.data) {
      return {
        data: response.data.data,
        message: response.data.message,
        status: response.status,
      };
    }
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const gisApiPut = async <T = any>(endpoint: string, data?: any): Promise<GisApiResponse<T>> => {
  try {
    const response: AxiosResponse<any> = await gisApiClient.put(endpoint, data);
    // GIS Server returns nested structure: { data: { data: { data: {...} } } }
    if (response.data?.data?.data) {
      return {
        data: response.data.data.data,
        message: response.data.data.message || response.data.message,
        status: response.status,
      };
    }
    // Fallback for single-nested structure
    if (response.data?.data) {
      return {
        data: response.data.data,
        message: response.data.message,
        status: response.status,
      };
    }
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const gisApiDelete = async <T = any>(endpoint: string): Promise<GisApiResponse<T>> => {
  try {
    const response: AxiosResponse<any> = await gisApiClient.delete(endpoint);
    // GIS Server returns nested structure: { data: { data: { data: {...} } } }
    if (response.data?.data?.data) {
      return {
        data: response.data.data.data,
        message: response.data.data.message || response.data.message,
        status: response.status,
      };
    }
    // Fallback for single-nested structure
    if (response.data?.data) {
      return {
        data: response.data.data,
        message: response.data.message,
        status: response.status,
      };
    }
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const gisApiPatch = async <T = any>(endpoint: string, data?: any): Promise<GisApiResponse<T>> => {
  try {
    const response: AxiosResponse<any> = await gisApiClient.patch(endpoint, data);
    // GIS Server returns nested structure: { data: { data: { data: {...} } } }
    if (response.data?.data?.data) {
      return {
        data: response.data.data.data,
        message: response.data.data.message || response.data.message,
        status: response.status,
      };
    }
    // Fallback for single-nested structure
    if (response.data?.data) {
      return {
        data: response.data.data,
        message: response.data.message,
        status: response.status,
      };
    }
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

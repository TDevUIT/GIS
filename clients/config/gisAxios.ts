import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

const gisBaseURL = process.env.NEXT_PUBLIC_GIS_SERVER_URL || 'http://api.urbanscale.online/gis';

export const gisApiClient: AxiosInstance = axios.create({
  baseURL: gisBaseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

gisApiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    console.log('🗺️ GIS API Request:', config.method?.toUpperCase(), config.url);

    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => {
    console.error('❌ GIS Request Error:', error);
    return Promise.reject(error);
  }
);

gisApiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log('✅ GIS API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    // Better error logging
    if (error.response) {
      // Server responded with error status
      console.error('❌ GIS Response Error:', error.response.status, error.response.config.url);
      console.error('Error data:', error.response.data);
    } else if (error.request) {
      // Request was made but no response
      console.error('❌ GIS Network Error: No response received');
      console.error('Request:', error.request);
      console.error('GIS Base URL:', gisBaseURL);
    } else {
      // Error in request setup
      console.error('❌ GIS Request Setup Error:', error.message);
    }

    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
      }
    }

    return Promise.reject(error);
  }
);

export default gisApiClient;

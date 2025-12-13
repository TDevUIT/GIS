import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

const baseURL = process.env.NEXT_PUBLIC_WEB_SERVER_URL || 'https://api.urbanscale.online';

export const apiClient: AxiosInstance = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    console.log('🚀 API Request:', config.method?.toUpperCase(), config.url);

    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log('✅ API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    // Better error logging
    if (error.response) {
      // Server responded with error status
      console.error('❌ Response Error:', error.response.status, error.response.config.url);
      console.error('Error data:', error.response.data);
    } else if (error.request) {
      // Request was made but no response
      console.error('❌ Network Error: No response received');
      console.error('Request:', error.request);
      console.error('Base URL:', baseURL);
    } else {
      // Error in request setup
      console.error('❌ Request Setup Error:', error.message);
    }

    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;

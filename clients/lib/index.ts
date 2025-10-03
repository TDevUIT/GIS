export * from './utils';

export const config = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  mapboxToken: process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '',
  arcgisApiKey: process.env.NEXT_PUBLIC_ARCGIS_API_KEY || '',
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production'
};

export const logger = {
  info: (message: string, data?: any) => {
    if (config.isDevelopment) {
      console.log(`[INFO] ${message}`, data || '');
    }
  },
  error: (message: string, error?: any) => {
    if (config.isDevelopment) {
      console.error(`[ERROR] ${message}`, error || '');
    }
  },
  warn: (message: string, data?: any) => {
    if (config.isDevelopment) {
      console.warn(`[WARN] ${message}`, data || '');
    }
  }
};

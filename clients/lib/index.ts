export * from './utils';

export const config = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://api.urbanscale.online',
  mapboxToken: process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '',
  arcgisApiKey: process.env.NEXT_PUBLIC_ARCGIS_API_KEY || '',
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production'
};

export const logger = {
  info: (message: string, data?: unknown) => {
    if (config.isDevelopment) {
      console.log(`[INFO] ${message}`, data || '');
    }
  },
  error: (message: string, error?: unknown) => {
    if (config.isDevelopment) {
      console.error(`[ERROR] ${message}`, error || '');
    }
  },
  warn: (message: string, data?: unknown) => {
    if (config.isDevelopment) {
      console.warn(`[WARN] ${message}`, data || '');
    }
  }
};

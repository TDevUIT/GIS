export const QUERY_STALE_TIME = {
  IMMEDIATE: 0,
  SHORT: 2 * 60 * 1000,        // 2 minutes
  MEDIUM: 5 * 60 * 1000,       // 5 minutes  
  LONG: 10 * 60 * 1000,        // 10 minutes
  VERY_LONG: 30 * 60 * 1000,   // 30 minutes
  HOURLY: 60 * 60 * 1000,      // 1 hour
  DAILY: 24 * 60 * 60 * 1000,  // 24 hours
} as const;

export const QUERY_REFETCH_INTERVAL = {
  REAL_TIME: 30 * 1000,        // 30 seconds
  FREQUENT: 2 * 60 * 1000,     // 2 minutes
  NORMAL: 5 * 60 * 1000,       // 5 minutes
  SLOW: 10 * 60 * 1000,        // 10 minutes
} as const;

export const QUERY_CACHE_TIME = {
  SHORT: 5 * 60 * 1000,        // 5 minutes
  MEDIUM: 10 * 60 * 1000,      // 10 minutes
  LONG: 30 * 60 * 1000,        // 30 minutes
  VERY_LONG: 60 * 60 * 1000,   // 1 hour
} as const;

export const QUERY_CONFIG = {
  traffic: {
    data: {
      staleTime: QUERY_STALE_TIME.SHORT,
      refetchInterval: QUERY_REFETCH_INTERVAL.FREQUENT,
    },
    incidents: {
      staleTime: QUERY_STALE_TIME.SHORT,
      refetchInterval: QUERY_REFETCH_INTERVAL.REAL_TIME,
    },
    analytics: {
      staleTime: QUERY_STALE_TIME.MEDIUM,
    },
  },
  airQuality: {
    data: {
      staleTime: QUERY_STALE_TIME.MEDIUM,
    },
    history: {
      staleTime: QUERY_STALE_TIME.LONG,
    },
    alerts: {
      staleTime: QUERY_STALE_TIME.MEDIUM,
      refetchInterval: QUERY_REFETCH_INTERVAL.NORMAL,
    },
    forecast: {
      staleTime: QUERY_STALE_TIME.VERY_LONG,
    },
  },
  gis: {
    districts: {
      staleTime: QUERY_STALE_TIME.DAILY,
    },
    wards: {
      staleTime: QUERY_STALE_TIME.DAILY,
    },
    layers: {
      staleTime: QUERY_STALE_TIME.HOURLY,
    },
    location: {
      staleTime: QUERY_STALE_TIME.LONG,
    },
    search: {
      staleTime: QUERY_STALE_TIME.MEDIUM,
    },
  },
  reports: {
    list: {
      staleTime: QUERY_STALE_TIME.MEDIUM,
    },
    status: {
      staleTime: QUERY_STALE_TIME.SHORT,
      refetchInterval: QUERY_REFETCH_INTERVAL.FREQUENT,
    },
  },
} as const;

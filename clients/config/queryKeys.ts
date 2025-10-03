
export const queryKeys = {
  traffic: {
    all: ['traffic'] as const,
    lists: () => [...queryKeys.traffic.all, 'list'] as const,
    list: (filters: string) => [...queryKeys.traffic.lists(), { filters }] as const,
    details: () => [...queryKeys.traffic.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.traffic.details(), id] as const,
    incidents: () => [...queryKeys.traffic.all, 'incidents'] as const,
    analytics: (dateRange: string) => [...queryKeys.traffic.all, 'analytics', dateRange] as const,
  },

  airQuality: {
    all: ['airQuality'] as const,
    lists: () => [...queryKeys.airQuality.all, 'list'] as const,
    list: (districtId?: string) => [...queryKeys.airQuality.lists(), { districtId }] as const,
    history: (dateRange: string) => [...queryKeys.airQuality.all, 'history', dateRange] as const,
    alerts: () => [...queryKeys.airQuality.all, 'alerts'] as const,
    forecast: (days: number) => [...queryKeys.airQuality.all, 'forecast', days] as const,
  },

  gis: {
    all: ['gis'] as const,
    districts: () => [...queryKeys.gis.all, 'districts'] as const,
    wards: (districtId: string) => [...queryKeys.gis.all, 'wards', districtId] as const,
    layers: () => [...queryKeys.gis.all, 'layers'] as const,
    location: (lat: number, lng: number) => [...queryKeys.gis.all, 'location', { lat, lng }] as const,
    search: (query: string) => [...queryKeys.gis.all, 'search', query] as const,
  },

  reports: {
    all: ['reports'] as const,
    lists: () => [...queryKeys.reports.all, 'list'] as const,
    list: (type?: string) => [...queryKeys.reports.lists(), { type }] as const,
    detail: (id: string) => [...queryKeys.reports.all, 'detail', id] as const,
    status: (id: string) => [...queryKeys.reports.all, 'status', id] as const,
  },

  incidents: {
    all: ['incidents'] as const,
    lists: () => [...queryKeys.incidents.all, 'list'] as const,
    list: (filters: Record<string, any>) => [...queryKeys.incidents.lists(), filters] as const,
    detail: (id: string) => [...queryKeys.incidents.all, 'detail', id] as const,
  },
} as const;

export const getInvalidationKeys = {
  traffic: () => queryKeys.traffic.all,
  airQuality: () => queryKeys.airQuality.all,
  gis: () => queryKeys.gis.all,
  reports: () => queryKeys.reports.all,
  incidents: () => queryKeys.incidents.all,
};


export const queryKeys = {
  accidents: {
    all: ['accidents'] as const,
    lists: () => [...queryKeys.accidents.all, 'list'] as const,
    list: () => [...queryKeys.accidents.lists()] as const,
    detail: (id: string) => [...queryKeys.accidents.all, 'detail', id] as const,
  },

  districts: {
    all: ['districts'] as const,
    lists: () => [...queryKeys.districts.all, 'list'] as const,
    list: () => [...queryKeys.districts.lists()] as const,
    detail: (id: string) => [...queryKeys.districts.all, 'detail', id] as const,
    containsPoint: (lng: number, lat: number) => [...queryKeys.districts.all, 'contains-point', { lng, lat }] as const,
    intersects: (wkt: string) => [...queryKeys.districts.all, 'intersects', wkt] as const,
    wards: (districtId: string) => [...queryKeys.districts.all, 'wards', districtId] as const,
  },

  wards: {
    all: ['wards'] as const,
    lists: () => [...queryKeys.wards.all, 'list'] as const,
    list: (districtId?: string) => [...queryKeys.wards.lists(), { districtId }] as const,
    detail: (id: string) => [...queryKeys.wards.all, 'detail', id] as const,
    containsPoint: (lng: number, lat: number) => [...queryKeys.wards.all, 'contains-point', { lng, lat }] as const,
    intersects: (wkt: string) => [...queryKeys.wards.all, 'intersects', wkt] as const,
  },

  populations: {
    all: ['populations'] as const,
    lists: () => [...queryKeys.populations.all, 'list'] as const,
    list: (districtId?: string, year?: number) => [...queryKeys.populations.lists(), { districtId, year }] as const,
    detail: (id: string) => [...queryKeys.populations.all, 'detail', id] as const,
  },

  infrastructures: {
    all: ['infrastructures'] as const,
    lists: () => [...queryKeys.infrastructures.all, 'list'] as const,
    list: (districtId?: string, category?: string) => [...queryKeys.infrastructures.lists(), { districtId, category }] as const,
    detail: (id: string) => [...queryKeys.infrastructures.all, 'detail', id] as const,
    withinRadius: (lng: number, lat: number, radius: number) => [...queryKeys.infrastructures.all, 'within-radius', { lng, lat, radius }] as const,
  },

  landUses: {
    all: ['landUses'] as const,
    lists: () => [...queryKeys.landUses.all, 'list'] as const,
    list: (districtId?: string, type?: string) => [...queryKeys.landUses.lists(), { districtId, type }] as const,
    detail: (id: string) => [...queryKeys.landUses.all, 'detail', id] as const,
    atPoint: (lng: number, lat: number) => [...queryKeys.landUses.all, 'at-point', { lng, lat }] as const,
    intersects: (wkt: string) => [...queryKeys.landUses.all, 'intersects', wkt] as const,
  },

  publicTransports: {
    all: ['publicTransports'] as const,
    lists: () => [...queryKeys.publicTransports.all, 'list'] as const,
    list: (districtId?: string, mode?: string) => [...queryKeys.publicTransports.lists(), { districtId, mode }] as const,
    detail: (id: string) => [...queryKeys.publicTransports.all, 'detail', id] as const,
    intersects: (wkt: string) => [...queryKeys.publicTransports.all, 'intersects', wkt] as const,
  },

  terrains: {
    all: ['terrains'] as const,
    lists: () => [...queryKeys.terrains.all, 'list'] as const,
    list: (districtId?: string) => [...queryKeys.terrains.lists(), { districtId }] as const,
    detail: (id: string) => [...queryKeys.terrains.all, 'detail', id] as const,
    atPoint: (lng: number, lat: number) => [...queryKeys.terrains.all, 'at-point', { lng, lat }] as const,
    intersects: (wkt: string) => [...queryKeys.terrains.all, 'intersects', wkt] as const,
  },

  urbanPlans: {
    all: ['urbanPlans'] as const,
    lists: () => [...queryKeys.urbanPlans.all, 'list'] as const,
    list: (districtId?: string, zoningType?: string) => [...queryKeys.urbanPlans.lists(), { districtId, zoningType }] as const,
    detail: (id: string) => [...queryKeys.urbanPlans.all, 'detail', id] as const,
    atPoint: (lng: number, lat: number) => [...queryKeys.urbanPlans.all, 'at-point', { lng, lat }] as const,
    intersects: (wkt: string) => [...queryKeys.urbanPlans.all, 'intersects', wkt] as const,
  },

  waterQuality: {
    all: ['waterQuality'] as const,
    lists: () => [...queryKeys.waterQuality.all, 'list'] as const,
    list: (districtId?: string, from?: string, to?: string) => [...queryKeys.waterQuality.lists(), { districtId, from, to }] as const,
    detail: (id: string) => [...queryKeys.waterQuality.all, 'detail', id] as const,
  },

  traffic: {
    all: ['traffic'] as const,
    lists: () => [...queryKeys.traffic.all, 'list'] as const,
    list: (districtId?: string, roadName?: string) => [...queryKeys.traffic.lists(), { districtId, roadName }] as const,
    detail: (id: string) => [...queryKeys.traffic.all, 'detail', id] as const,
    intersects: (wkt: string) => [...queryKeys.traffic.all, 'intersects', wkt] as const,
  },

  airQuality: {
    all: ['airQuality'] as const,
    lists: () => [...queryKeys.airQuality.all, 'list'] as const,
    list: (districtId?: string, from?: string, to?: string) => [...queryKeys.airQuality.lists(), { districtId, from, to }] as const,
    detail: (id: string) => [...queryKeys.airQuality.all, 'detail', id] as const,
  },

  analytics: {
    all: ['analytics'] as const,
    summary: () => [...queryKeys.analytics.all, 'summary'] as const,
    trafficStats: (dateRange?: string) => [...queryKeys.analytics.all, 'traffic', dateRange] as const,
    airQualityStats: (dateRange?: string) => [...queryKeys.analytics.all, 'airQuality', dateRange] as const,
  },

  gis: {
    all: ['gis'] as const,
    accidents: {
      lists: () => [...queryKeys.gis.all, 'accidents', 'list'] as const,
      list: () => [...queryKeys.gis.accidents.lists()] as const,
      detail: (id: string) => [...queryKeys.gis.all, 'accidents', 'detail', id] as const,
    },
    airQualities: {
      lists: () => [...queryKeys.gis.all, 'airQualities', 'list'] as const,
      list: (districtId?: string, from?: string, to?: string) => [...queryKeys.gis.airQualities.lists(), { districtId, from, to }] as const,
      detail: (id: string) => [...queryKeys.gis.all, 'airQualities', 'detail', id] as const,
    },
    analytics: {
      summary: () => [...queryKeys.gis.all, 'analytics', 'summary'] as const,
      accidents: () => [...queryKeys.gis.all, 'analytics', 'accidents'] as const,
      traffic: () => [...queryKeys.gis.all, 'analytics', 'traffic'] as const,
      environmental: () => [...queryKeys.gis.all, 'analytics', 'environmental'] as const,
    },
    districts: {
      lists: () => [...queryKeys.gis.all, 'districts', 'list'] as const,
      list: () => [...queryKeys.gis.districts.lists()] as const,
      detail: (id: string) => [...queryKeys.gis.all, 'districts', 'detail', id] as const,
      containsPoint: (lng: number, lat: number) => [...queryKeys.gis.all, 'districts', 'contains-point', { lng, lat }] as const,
      intersects: (wkt: string) => [...queryKeys.gis.all, 'districts', 'intersects', wkt] as const,
      wards: (districtId: string) => [...queryKeys.gis.all, 'districts', 'wards', districtId] as const,
    },
    infrastructures: {
      lists: () => [...queryKeys.gis.all, 'infrastructures', 'list'] as const,
      list: (districtId?: string, category?: string) => [...queryKeys.gis.infrastructures.lists(), { districtId, category }] as const,
      detail: (id: string) => [...queryKeys.gis.all, 'infrastructures', 'detail', id] as const,
      withinRadius: (lng: number, lat: number, radius: number) => [...queryKeys.gis.all, 'infrastructures', 'within-radius', { lng, lat, radius }] as const,
    },
    landUses: {
      lists: () => [...queryKeys.gis.all, 'landUses', 'list'] as const,
      list: (districtId?: string, type?: string) => [...queryKeys.gis.landUses.lists(), { districtId, type }] as const,
      detail: (id: string) => [...queryKeys.gis.all, 'landUses', 'detail', id] as const,
      atPoint: (lng: number, lat: number) => [...queryKeys.gis.all, 'landUses', 'at-point', { lng, lat }] as const,
      intersects: (wkt: string) => [...queryKeys.gis.all, 'landUses', 'intersects', wkt] as const,
    },
    populations: {
      lists: () => [...queryKeys.gis.all, 'populations', 'list'] as const,
      list: (districtId?: string, year?: number) => [...queryKeys.gis.populations.lists(), { districtId, year }] as const,
      detail: (id: string) => [...queryKeys.gis.all, 'populations', 'detail', id] as const,
    },
    publicTransports: {
      lists: () => [...queryKeys.gis.all, 'publicTransports', 'list'] as const,
      list: (districtId?: string, mode?: string) => [...queryKeys.gis.publicTransports.lists(), { districtId, mode }] as const,
      detail: (id: string) => [...queryKeys.gis.all, 'publicTransports', 'detail', id] as const,
      intersects: (wkt: string) => [...queryKeys.gis.all, 'publicTransports', 'intersects', wkt] as const,
    },
    terrains: {
      lists: () => [...queryKeys.gis.all, 'terrains', 'list'] as const,
      list: (districtId?: string) => [...queryKeys.gis.terrains.lists(), { districtId }] as const,
      detail: (id: string) => [...queryKeys.gis.all, 'terrains', 'detail', id] as const,
      atPoint: (lng: number, lat: number) => [...queryKeys.gis.all, 'terrains', 'at-point', { lng, lat }] as const,
      intersects: (wkt: string) => [...queryKeys.gis.all, 'terrains', 'intersects', wkt] as const,
    },
    traffics: {
      lists: () => [...queryKeys.gis.all, 'traffics', 'list'] as const,
      list: (districtId?: string, roadName?: string) => [...queryKeys.gis.traffics.lists(), { districtId, roadName }] as const,
      detail: (id: string) => [...queryKeys.gis.all, 'traffics', 'detail', id] as const,
      intersects: (wkt: string) => [...queryKeys.gis.all, 'traffics', 'intersects', wkt] as const,
    },
    urbanPlans: {
      lists: () => [...queryKeys.gis.all, 'urbanPlans', 'list'] as const,
      list: (districtId?: string, zoningType?: string) => [...queryKeys.gis.urbanPlans.lists(), { districtId, zoningType }] as const,
      detail: (id: string) => [...queryKeys.gis.all, 'urbanPlans', 'detail', id] as const,
      atPoint: (lng: number, lat: number) => [...queryKeys.gis.all, 'urbanPlans', 'at-point', { lng, lat }] as const,
      intersects: (wkt: string) => [...queryKeys.gis.all, 'urbanPlans', 'intersects', wkt] as const,
    },
    wards: {
      lists: () => [...queryKeys.gis.all, 'wards', 'list'] as const,
      list: (districtId?: string) => [...queryKeys.gis.wards.lists(), { districtId }] as const,
      detail: (id: string) => [...queryKeys.gis.all, 'wards', 'detail', id] as const,
      containsPoint: (lng: number, lat: number) => [...queryKeys.gis.all, 'wards', 'contains-point', { lng, lat }] as const,
      intersects: (wkt: string) => [...queryKeys.gis.all, 'wards', 'intersects', wkt] as const,
    },
    waterQualities: {
      lists: () => [...queryKeys.gis.all, 'waterQualities', 'list'] as const,
      list: (districtId?: string, from?: string, to?: string) => [...queryKeys.gis.waterQualities.lists(), { districtId, from, to }] as const,
      detail: (id: string) => [...queryKeys.gis.all, 'waterQualities', 'detail', id] as const,
    },
  },
} as const;

export const getInvalidationKeys = {
  accidents: () => queryKeys.accidents.all,
  districts: () => queryKeys.districts.all,
  wards: () => queryKeys.wards.all,
  populations: () => queryKeys.populations.all,
  infrastructures: () => queryKeys.infrastructures.all,
  landUses: () => queryKeys.landUses.all,
  publicTransports: () => queryKeys.publicTransports.all,
  terrains: () => queryKeys.terrains.all,
  urbanPlans: () => queryKeys.urbanPlans.all,
  waterQuality: () => queryKeys.waterQuality.all,
  traffic: () => queryKeys.traffic.all,
  airQuality: () => queryKeys.airQuality.all,
  analytics: () => queryKeys.analytics.all,
  gis: () => queryKeys.gis.all,
};

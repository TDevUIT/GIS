export const GisEndpoints = {
  districts: {
    base: '/districts',
    byId: (id: string) => `/districts/${id}`,
    wardsOfDistrict: (districtId: string) => `/districts/${districtId}/wards`,
    containsPoint: '/districts/contains-point',
    intersectsWith: '/districts/intersects-with',
  },
  wards: {
    base: '/wards',
    byId: (id: string) => `/wards/${id}`,
    containsPoint: '/wards/contains-point',
    intersectsWith: '/wards/intersects-with',
  },
  infrastructures: {
    base: '/infrastructures',
    byId: (id: string) => `/infrastructures/${id}`,
    withinRadius: '/infrastructures/within-radius',
    upload: '/infrastructures/upload',
    images: (infraId: string) => `/infrastructures/${infraId}/images`,
    imageById: (infraId: string, imageId: string) =>
      `/infrastructures/${infraId}/images/${imageId}`,
  },
  accidents: {
    base: '/accidents',
    byId: (id: string) => `/accidents/${id}`,
    upload: '/accidents/upload',
    images: (accidentId: string) => `/accidents/${accidentId}/images`,
    imageById: (accidentId: string, imageId: string) =>
      `/accidents/${accidentId}/images/${imageId}`,
  },
  traffics: {
    base: '/traffics',
    byId: (id: string) => `/traffics/${id}`,
    intersectsWith: '/traffics/intersects-with',
  },
  publicTransports: {
    base: '/public-transports',
    byId: (id: string) => `/public-transports/${id}`,
    intersectsWith: '/public-transports/intersects-with',
  },
  landUses: {
    base: '/land-uses',
    byId: (id: string) => `/land-uses/${id}`,
    atPoint: '/land-uses/at-point',
    intersectsWith: '/land-uses/intersects-with',
  },
  urbanPlans: {
    base: '/urban-plans',
    byId: (id: string) => `/urban-plans/${id}`,
    atPoint: '/urban-plans/at-point',
    intersectsWith: '/urban-plans/intersects-with',
  },
  terrains: {
    base: '/terrains',
    byId: (id: string) => `/terrains/${id}`,
    atPoint: '/terrains/at-point',
    intersectsWith: '/terrains/intersects-with',
  },
  airQualities: {
    base: '/air-qualities',
    byId: (id: string) => `/air-qualities/${id}`,
    withinRadius: '/air-qualities/within-radius',
  },
  waterQualities: {
    base: '/water-qualities',
    byId: (id: string) => `/water-qualities/${id}`,
    withinRadius: '/water-qualities/within-radius',
  },
  populations: {
    base: '/populations',
    byId: (id: string) => `/populations/${id}`,
  },
  analytics: {
    summary: '/analytics/summary',
    infrastructureByCategory: '/analytics/infrastructure-by-category',
    populationHistory: (districtId: string) =>
      `/analytics/population-history/${districtId}`,
    landUseSummary: '/analytics/land-use-summary',
    airQualityHistory: (districtId: string) =>
      `/analytics/air-quality-history/${districtId}`,
    waterQualityHistory: (districtId: string) =>
      `/analytics/water-quality-history/${districtId}`,
    accidentSummaryBySeverity: '/analytics/accident-summary-by-severity',
    recentActivities: '/analytics/recent-activities',
    demographicsSummary: (populationId: string) =>
      `/analytics/demographics-summary/${populationId}`,
    householdsSummary: (populationId: string) =>
      `/analytics/households-summary/${populationId}`,
    accidentHotspots: '/analytics/accident-hotspots',
    accidentsByTimeOfDay: '/analytics/accidents-by-time-of-day',
    accidentsByDayOfWeek: '/analytics/accidents-by-day-of-week',
    trafficRiskAssessment: '/analytics/traffic-risk-assessment',
    publicTransportSummaryByMode: '/analytics/public-transport-summary-by-mode',
    publicTransportCapacityByMode: '/analytics/public-transport-capacity-by-mode',
    mostFrequentRoutes: '/analytics/most-frequent-routes',
    airQualityRankingByDistrict: '/analytics/air-quality-ranking-by-district',
    waterQualityRankingByDistrict: '/analytics/water-quality-ranking-by-district',
    terrainSummaryByDistrict: '/analytics/terrain-summary-by-district',
    landslideRiskAreas: '/analytics/landslide-risk-areas',
    floodProneAreas: '/analytics/flood-prone-areas',
    soilTypeDistribution: '/analytics/soil-type-distribution',
  },
} as const;

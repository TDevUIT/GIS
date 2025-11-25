import { gisApiGet, GisApiResponse } from './common/gisApi';

// GET global summary
export const getGlobalSummary = async (): Promise<GisApiResponse> => {
  return gisApiGet('/analytics/summary');
};

// GET infrastructure by category
export const getInfrastructureByCategory = async (): Promise<GisApiResponse> => {
  return gisApiGet('/analytics/infrastructure-by-category');
};

// GET population history by district
export const getPopulationHistory = async (districtId: string): Promise<GisApiResponse> => {
  return gisApiGet(`/analytics/population-history/${districtId}`);
};

// GET land use summary
export const getLandUseSummary = async (districtId: string, year?: number): Promise<GisApiResponse> => {
  const params = year ? `?districtId=${districtId}&year=${year}` : `?districtId=${districtId}`;
  return gisApiGet(`/analytics/land-use-summary${params}`);
};

// GET air quality history by district
export const getAirQualityHistory = async (districtId: string): Promise<GisApiResponse> => {
  return gisApiGet(`/analytics/air-quality-history/${districtId}`);
};

// GET water quality history by district
export const getWaterQualityHistory = async (districtId: string): Promise<GisApiResponse> => {
  return gisApiGet(`/analytics/water-quality-history/${districtId}`);
};

// GET accident summary by severity
export const getAccidentSummaryBySeverity = async (): Promise<GisApiResponse> => {
  return gisApiGet('/analytics/accident-summary-by-severity');
};

// GET recent activities
export const getRecentActivities = async (): Promise<GisApiResponse> => {
  return gisApiGet('/analytics/recent-activities');
};

// GET demographics summary
export const getDemographicsSummary = async (populationId: string): Promise<GisApiResponse> => {
  return gisApiGet(`/analytics/demographics-summary/${populationId}`);
};

// GET households summary
export const getHouseholdsSummary = async (populationId: string): Promise<GisApiResponse> => {
  return gisApiGet(`/analytics/households-summary/${populationId}`);
};

// GET accident hotspots
export const getAccidentHotspots = async (): Promise<GisApiResponse> => {
  return gisApiGet('/analytics/accident-hotspots');
};

// GET accidents by time of day
export const getAccidentsByTimeOfDay = async (): Promise<GisApiResponse> => {
  return gisApiGet('/analytics/accidents-by-time-of-day');
};

// GET accidents by day of week
export const getAccidentsByDayOfWeek = async (): Promise<GisApiResponse> => {
  return gisApiGet('/analytics/accidents-by-day-of-week');
};

// GET traffic risk assessment
export const getTrafficRiskAssessment = async (): Promise<GisApiResponse> => {
  return gisApiGet('/analytics/traffic-risk-assessment');
};

// GET public transport summary by mode
export const getPublicTransportSummaryByMode = async (): Promise<GisApiResponse> => {
  return gisApiGet('/analytics/public-transport-summary-by-mode');
};

// GET public transport capacity by mode
export const getPublicTransportCapacityByMode = async (): Promise<GisApiResponse> => {
  return gisApiGet('/analytics/public-transport-capacity-by-mode');
};

// GET most frequent routes
export const getMostFrequentRoutes = async (): Promise<GisApiResponse> => {
  return gisApiGet('/analytics/most-frequent-routes');
};

// GET air quality ranking by district
export const getAirQualityRankingByDistrict = async (): Promise<GisApiResponse> => {
  return gisApiGet('/analytics/air-quality-ranking-by-district');
};

// GET water quality ranking by district
export const getWaterQualityRankingByDistrict = async (): Promise<GisApiResponse> => {
  return gisApiGet('/analytics/water-quality-ranking-by-district');
};

// GET terrain summary by district
export const getTerrainSummaryByDistrict = async (): Promise<GisApiResponse> => {
  return gisApiGet('/analytics/terrain-summary-by-district');
};

// GET landslide risk areas
export const getLandslideRiskAreas = async (slopeThreshold?: number): Promise<GisApiResponse> => {
  const params = slopeThreshold ? `?slopeThreshold=${slopeThreshold}` : '';
  return gisApiGet(`/analytics/landslide-risk-areas${params}`);
};

// GET flood prone areas
export const getFloodProneAreas = async (elevationThreshold?: number): Promise<GisApiResponse> => {
  const params = elevationThreshold ? `?elevationThreshold=${elevationThreshold}` : '';
  return gisApiGet(`/analytics/flood-prone-areas${params}`);
};

// GET soil type distribution
export const getSoilTypeDistribution = async (): Promise<GisApiResponse> => {
  return gisApiGet('/analytics/soil-type-distribution');
};

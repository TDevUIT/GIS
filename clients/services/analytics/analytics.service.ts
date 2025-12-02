import { apiGet, ApiResponse } from '../common/api';

// GET global summary
export const getGlobalSummary = async (): Promise<ApiResponse> => {
  return apiGet('/analytics/summary');
};

// GET infrastructure by category
export const getInfrastructureByCategory = async (): Promise<ApiResponse> => {
  return apiGet('/analytics/infrastructure-by-category');
};

// GET population history by district
export const getPopulationHistory = async (districtId: string): Promise<ApiResponse> => {
  return apiGet(`/analytics/population-history/${districtId}`);
};

// GET land use summary
export const getLandUseSummary = async (districtId: string, year?: number): Promise<ApiResponse> => {
  const params = year ? `?districtId=${districtId}&year=${year}` : `?districtId=${districtId}`;
  return apiGet(`/analytics/land-use-summary${params}`);
};

// GET air quality history by district
export const getAirQualityHistory = async (districtId: string): Promise<ApiResponse> => {
  return apiGet(`/analytics/air-quality-history/${districtId}`);
};

// GET water quality history by district
export const getWaterQualityHistory = async (districtId: string): Promise<ApiResponse> => {
  return apiGet(`/analytics/water-quality-history/${districtId}`);
};

// GET accident summary by severity
export const getAccidentSummaryBySeverity = async (): Promise<ApiResponse> => {
  return apiGet('/analytics/accident-summary-by-severity');
};

// GET recent activities
export const getRecentActivities = async (): Promise<ApiResponse> => {
  return apiGet('/analytics/recent-activities');
};

// GET demographics summary
export const getDemographicsSummary = async (populationId: string): Promise<ApiResponse> => {
  return apiGet(`/analytics/demographics-summary/${populationId}`);
};

// GET households summary
export const getHouseholdsSummary = async (populationId: string): Promise<ApiResponse> => {
  return apiGet(`/analytics/households-summary/${populationId}`);
};

// GET accident hotspots
export const getAccidentHotspots = async (): Promise<ApiResponse> => {
  return apiGet('/analytics/accident-hotspots');
};

// GET accidents by time of day
export const getAccidentsByTimeOfDay = async (): Promise<ApiResponse> => {
  return apiGet('/analytics/accidents-by-time-of-day');
};

// GET accidents by day of week
export const getAccidentsByDayOfWeek = async (): Promise<ApiResponse> => {
  return apiGet('/analytics/accidents-by-day-of-week');
};

// GET traffic risk assessment
export const getTrafficRiskAssessment = async (): Promise<ApiResponse> => {
  return apiGet('/analytics/traffic-risk-assessment');
};

// GET public transport summary by mode
export const getPublicTransportSummaryByMode = async (): Promise<ApiResponse> => {
  return apiGet('/analytics/public-transport-summary-by-mode');
};

// GET public transport capacity by mode
export const getPublicTransportCapacityByMode = async (): Promise<ApiResponse> => {
  return apiGet('/analytics/public-transport-capacity-by-mode');
};

// GET most frequent routes
export const getMostFrequentRoutes = async (): Promise<ApiResponse> => {
  return apiGet('/analytics/most-frequent-routes');
};

// GET air quality ranking by district
export const getAirQualityRankingByDistrict = async (): Promise<ApiResponse> => {
  return apiGet('/analytics/air-quality-ranking-by-district');
};

// GET water quality ranking by district
export const getWaterQualityRankingByDistrict = async (): Promise<ApiResponse> => {
  return apiGet('/analytics/water-quality-ranking-by-district');
};

// GET terrain summary by district
export const getTerrainSummaryByDistrict = async (): Promise<ApiResponse> => {
  return apiGet('/analytics/terrain-summary-by-district');
};

// GET landslide risk areas
export const getLandslideRiskAreas = async (slopeThreshold?: number): Promise<ApiResponse> => {
  const params = slopeThreshold ? `?slopeThreshold=${slopeThreshold}` : '';
  return apiGet(`/analytics/landslide-risk-areas${params}`);
};

// GET flood prone areas
export const getFloodProneAreas = async (elevationThreshold?: number): Promise<ApiResponse> => {
  const params = elevationThreshold ? `?elevationThreshold=${elevationThreshold}` : '';
  return apiGet(`/analytics/flood-prone-areas${params}`);
};

// GET soil type distribution
export const getSoilTypeDistribution = async (): Promise<ApiResponse> => {
  return apiGet('/analytics/soil-type-distribution');
};



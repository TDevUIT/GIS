import { useQuery } from '@tanstack/react-query';
import { 
  getGlobalSummary, 
  getTrafficStats, 
  getAirQualityStats,
  getInfrastructureByCategory,
  getPopulationHistory,
  getLandUseSummary,
  getAirQualityHistory,
  getWaterQualityHistory,
  getAccidentSummaryBySeverity,
  getRecentActivities,
  getAccidentHotspots,
  getAccidentsByTimeOfDay,
  getAccidentsByDayOfWeek,
  getTrafficRiskAssessment,
  getPublicTransportSummaryByMode,
  getPublicTransportCapacityByMode,
  getMostFrequentRoutes,
  getAirQualityRankingByDistrict,
  getWaterQualityRankingByDistrict,
  getTerrainSummaryByDistrict,
  getLandslideRiskAreas,
  getFloodProneAreas,
  getSoilTypeDistribution,
  getDemographicsSummary,
  getHouseholdsSummary
} from '@/services/analyticsService';
import { queryKeys } from '@/config/queryKeys';
import { QUERY_STALE_TIME } from '@/config/queryConfig';

export function useAnalyticsSummary() {
  return useQuery({
    queryKey: queryKeys.analytics.summary(),
    queryFn: getGlobalSummary,
    staleTime: QUERY_STALE_TIME.MEDIUM,
  });
}

export function useTrafficStats(dateRange?: string) {
  return useQuery({
    queryKey: queryKeys.analytics.trafficStats(dateRange),
    queryFn: () => getTrafficStats(dateRange),
    staleTime: QUERY_STALE_TIME.MEDIUM,
  });
}

export function useAirQualityStats(dateRange?: string) {
  return useQuery({
    queryKey: queryKeys.analytics.airQualityStats(dateRange),
    queryFn: () => getAirQualityStats(dateRange),
    staleTime: QUERY_STALE_TIME.MEDIUM,
  });
}

export function useInfrastructureByCategory() {
  return useQuery({
    queryKey: ['analytics', 'infrastructure-by-category'],
    queryFn: getInfrastructureByCategory,
    staleTime: QUERY_STALE_TIME.LONG,
  });
}

export function usePopulationHistory(districtId: string) {
  return useQuery({
    queryKey: ['analytics', 'population-history', districtId],
    queryFn: () => getPopulationHistory(districtId),
    enabled: !!districtId,
    staleTime: QUERY_STALE_TIME.LONG,
  });
}

export function useLandUseSummary(districtId: string, year?: number) {
  return useQuery({
    queryKey: ['analytics', 'land-use-summary', districtId, year],
    queryFn: () => getLandUseSummary(districtId, year),
    enabled: !!districtId,
    staleTime: QUERY_STALE_TIME.LONG,
  });
}

export function useAccidentSummaryBySeverity() {
  return useQuery({
    queryKey: ['analytics', 'accident-summary-by-severity'],
    queryFn: getAccidentSummaryBySeverity,
    staleTime: QUERY_STALE_TIME.MEDIUM,
  });
}

export function useRecentActivities() {
  return useQuery({
    queryKey: ['analytics', 'recent-activities'],
    queryFn: getRecentActivities,
    staleTime: QUERY_STALE_TIME.SHORT,
  });
}

export function useAccidentHotspots() {
  return useQuery({
    queryKey: ['analytics', 'accident-hotspots'],
    queryFn: getAccidentHotspots,
    staleTime: QUERY_STALE_TIME.LONG,
  });
}

export function usePublicTransportSummary() {
  return useQuery({
    queryKey: ['analytics', 'public-transport-summary'],
    queryFn: getPublicTransportSummaryByMode,
    staleTime: QUERY_STALE_TIME.LONG,
  });
}

export function useAirQualityRanking() {
  return useQuery({
    queryKey: ['analytics', 'air-quality-ranking'],
    queryFn: getAirQualityRankingByDistrict,
    staleTime: QUERY_STALE_TIME.MEDIUM,
  });
}

export function useWaterQualityRanking() {
  return useQuery({
    queryKey: ['analytics', 'water-quality-ranking'],
    queryFn: getWaterQualityRankingByDistrict,
    staleTime: QUERY_STALE_TIME.MEDIUM,
  });
}

// ========== Environment History ==========

export function useAirQualityHistory(districtId: string) {
  return useQuery({
    queryKey: ['analytics', 'air-quality-history', districtId],
    queryFn: () => getAirQualityHistory(districtId),
    enabled: !!districtId,
    staleTime: QUERY_STALE_TIME.LONG,
  });
}

export function useWaterQualityHistory(districtId: string) {
  return useQuery({
    queryKey: ['analytics', 'water-quality-history', districtId],
    queryFn: () => getWaterQualityHistory(districtId),
    enabled: !!districtId,
    staleTime: QUERY_STALE_TIME.LONG,
  });
}

// ========== Demographics ==========

export function useDemographicsSummary(populationId: string) {
  return useQuery({
    queryKey: ['analytics', 'demographics-summary', populationId],
    queryFn: () => getDemographicsSummary(populationId),
    enabled: !!populationId,
    staleTime: QUERY_STALE_TIME.LONG,
  });
}

export function useHouseholdsSummary(populationId: string) {
  return useQuery({
    queryKey: ['analytics', 'households-summary', populationId],
    queryFn: () => getHouseholdsSummary(populationId),
    enabled: !!populationId,
    staleTime: QUERY_STALE_TIME.LONG,
  });
}

// ========== Accident Time Analysis ==========

export function useAccidentsByTimeOfDay() {
  return useQuery({
    queryKey: ['analytics', 'accidents-by-time-of-day'],
    queryFn: getAccidentsByTimeOfDay,
    staleTime: QUERY_STALE_TIME.MEDIUM,
  });
}

export function useAccidentsByDayOfWeek() {
  return useQuery({
    queryKey: ['analytics', 'accidents-by-day-of-week'],
    queryFn: getAccidentsByDayOfWeek,
    staleTime: QUERY_STALE_TIME.MEDIUM,
  });
}

export function useTrafficRiskAssessment() {
  return useQuery({
    queryKey: ['analytics', 'traffic-risk-assessment'],
    queryFn: getTrafficRiskAssessment,
    staleTime: QUERY_STALE_TIME.MEDIUM,
  });
}

// ========== Public Transport ==========

export function usePublicTransportCapacity() {
  return useQuery({
    queryKey: ['analytics', 'public-transport-capacity'],
    queryFn: getPublicTransportCapacityByMode,
    staleTime: QUERY_STALE_TIME.LONG,
  });
}

export function useMostFrequentRoutes() {
  return useQuery({
    queryKey: ['analytics', 'most-frequent-routes'],
    queryFn: getMostFrequentRoutes,
    staleTime: QUERY_STALE_TIME.MEDIUM,
  });
}

// ========== Terrain Analysis ==========

export function useTerrainSummary() {
  return useQuery({
    queryKey: ['analytics', 'terrain-summary'],
    queryFn: getTerrainSummaryByDistrict,
    staleTime: QUERY_STALE_TIME.LONG,
  });
}

export function useLandslideRiskAreas(slopeThreshold?: number) {
  return useQuery({
    queryKey: ['analytics', 'landslide-risk-areas', slopeThreshold],
    queryFn: () => getLandslideRiskAreas(slopeThreshold),
    staleTime: QUERY_STALE_TIME.LONG,
  });
}

export function useFloodProneAreas(elevationThreshold?: number) {
  return useQuery({
    queryKey: ['analytics', 'flood-prone-areas', elevationThreshold],
    queryFn: () => getFloodProneAreas(elevationThreshold),
    staleTime: QUERY_STALE_TIME.LONG,
  });
}

export function useSoilTypeDistribution() {
  return useQuery({
    queryKey: ['analytics', 'soil-type-distribution'],
    queryFn: getSoilTypeDistribution,
    staleTime: QUERY_STALE_TIME.LONG,
  });
}

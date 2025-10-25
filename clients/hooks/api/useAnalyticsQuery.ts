import { useQuery } from '@tanstack/react-query';
import { 
  getGlobalSummary, 
  getTrafficStats, 
  getAirQualityStats 
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

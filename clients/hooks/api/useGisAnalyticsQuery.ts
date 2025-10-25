import { useQuery } from '@tanstack/react-query';
import { 
  getSummaryGIS, 
  getAccidentStatsGIS, 
  getTrafficStatsGIS, 
  getEnvironmentalStatsGIS 
} from '@/services/gisAnalyticsService';
import { queryKeys } from '@/config/queryKeys';
import { QUERY_STALE_TIME } from '@/config/queryConfig';

export function useGisSummary() {
  return useQuery({
    queryKey: queryKeys.gis.analytics.summary(),
    queryFn: getSummaryGIS,
    staleTime: QUERY_STALE_TIME.MEDIUM,
  });
}

export function useGisAccidentStats() {
  return useQuery({
    queryKey: queryKeys.gis.analytics.accidents(),
    queryFn: getAccidentStatsGIS,
    staleTime: QUERY_STALE_TIME.MEDIUM,
  });
}

export function useGisTrafficStats() {
  return useQuery({
    queryKey: queryKeys.gis.analytics.traffic(),
    queryFn: getTrafficStatsGIS,
    staleTime: QUERY_STALE_TIME.MEDIUM,
  });
}

export function useGisEnvironmentalStats() {
  return useQuery({
    queryKey: queryKeys.gis.analytics.environmental(),
    queryFn: getEnvironmentalStatsGIS,
    staleTime: QUERY_STALE_TIME.MEDIUM,
  });
}

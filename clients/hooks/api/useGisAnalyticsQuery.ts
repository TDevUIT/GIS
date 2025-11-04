import { useQuery } from '@tanstack/react-query';
import { 
  getSummaryGIS
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

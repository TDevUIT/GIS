import { useQuery } from '@tanstack/react-query';
import { getAllAirQualities, getAirQualityById } from '@/services/airQualityService';
import { queryKeys } from '@/config/queryKeys';
import { QUERY_STALE_TIME } from '@/config/queryConfig';

export function useAirQualities(districtId?: string, from?: string, to?: string) {
  return useQuery({
    queryKey: queryKeys.airQuality.list(districtId, from, to),
    queryFn: () => getAllAirQualities(districtId, from, to),
    staleTime: QUERY_STALE_TIME.MEDIUM,
  });
}

export function useAirQuality(id: string) {
  return useQuery({
    queryKey: queryKeys.airQuality.detail(id),
    queryFn: () => getAirQualityById(id),
    enabled: !!id,
    staleTime: QUERY_STALE_TIME.MEDIUM,
  });
}

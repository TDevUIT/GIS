import { useQuery } from '@tanstack/react-query';
import { getAllWaterQualities, getWaterQualityById } from '@/services';
import { queryKeys } from '@/config/queryKeys';
import { QUERY_STALE_TIME } from '@/config/queryConfig';

export function useWaterQualities(districtId?: string, from?: string, to?: string) {
  return useQuery({
    queryKey: queryKeys.waterQuality.list(districtId, from, to),
    queryFn: () => getAllWaterQualities({ districtId, from, to }),
    staleTime: QUERY_STALE_TIME.MEDIUM,
  });
}

export function useWaterQuality(id: string) {
  return useQuery({
    queryKey: queryKeys.waterQuality.detail(id),
    queryFn: () => getWaterQualityById(id),
    enabled: !!id,
    staleTime: QUERY_STALE_TIME.MEDIUM,
  });
}



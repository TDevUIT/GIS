import { useQuery } from '@tanstack/react-query';
import { getAllWaterQualitiesGIS, getWaterQualityByIdGIS } from '@/services/gisWaterQualitiesService';
import { queryKeys } from '@/config/queryKeys';
import { QUERY_STALE_TIME } from '@/config/queryConfig';

export function useGisWaterQualities(districtId?: string, from?: string, to?: string) {
  return useQuery({
    queryKey: queryKeys.gis.waterQualities.list(districtId, from, to),
    queryFn: () => getAllWaterQualitiesGIS(districtId, from, to),
    staleTime: QUERY_STALE_TIME.MEDIUM,
  });
}

export function useGisWaterQuality(id: string) {
  return useQuery({
    queryKey: queryKeys.gis.waterQualities.detail(id),
    queryFn: () => getWaterQualityByIdGIS(id),
    enabled: !!id,
    staleTime: QUERY_STALE_TIME.MEDIUM,
  });
}

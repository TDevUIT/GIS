import { useQuery } from '@tanstack/react-query';
import { getAllWaterQualitiesGIS, getWaterQualityByIdGIS } from '@/services/gisWaterQualitiesService';
import { queryKeys } from '@/config/queryKeys';
import { QUERY_STALE_TIME } from '@/config/queryConfig';

interface WaterQualityQuery {
  districtId?: string;
  from?: string;
  to?: string;
}

export function useGisWaterQualities(query?: WaterQualityQuery) {
  return useQuery({
    queryKey: queryKeys.gis.waterQualities.list(query?.districtId, query?.from, query?.to),
    queryFn: () => getAllWaterQualitiesGIS(query),
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

import { useQuery } from '@tanstack/react-query';
import { getAllAirQualitiesGIS, getAirQualityByIdGIS } from '@/services/gisAirQualitiesService';
import { queryKeys } from '@/config/queryKeys';
import { QUERY_STALE_TIME } from '@/config/queryConfig';

interface AirQualityQuery {
  districtId?: string;
  from?: string;
  to?: string;
}

export function useGisAirQualities(query?: AirQualityQuery) {
  return useQuery({
    queryKey: queryKeys.gis.airQualities.list(query?.districtId, query?.from, query?.to),
    queryFn: () => getAllAirQualitiesGIS(query),
    staleTime: QUERY_STALE_TIME.MEDIUM,
  });
}

export function useGisAirQuality(id: string) {
  return useQuery({
    queryKey: queryKeys.gis.airQualities.detail(id),
    queryFn: () => getAirQualityByIdGIS(id),
    enabled: !!id,
    staleTime: QUERY_STALE_TIME.MEDIUM,
  });
}

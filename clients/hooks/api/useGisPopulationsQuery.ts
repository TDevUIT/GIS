import { useQuery } from '@tanstack/react-query';
import { getAllPopulationsGIS, getPopulationByIdGIS } from '@/services/gisPopulationsService';
import { queryKeys } from '@/config/queryKeys';
import { QUERY_STALE_TIME } from '@/config/queryConfig';

export function useGisPopulations(districtId?: string, year?: number) {
  return useQuery({
    queryKey: queryKeys.gis.populations.list(districtId, year),
    queryFn: () => getAllPopulationsGIS(districtId, year),
    staleTime: QUERY_STALE_TIME.HOURLY,
  });
}

export function useGisPopulation(id: string) {
  return useQuery({
    queryKey: queryKeys.gis.populations.detail(id),
    queryFn: () => getPopulationByIdGIS(id),
    enabled: !!id,
    staleTime: QUERY_STALE_TIME.HOURLY,
  });
}

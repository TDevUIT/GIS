import { useQuery } from '@tanstack/react-query';
import { getAllAccidentsGIS, getAccidentByIdGIS } from '@/services/gisAccidentsService';
import { queryKeys } from '@/config/queryKeys';
import { QUERY_STALE_TIME } from '@/config/queryConfig';

export function useGisAccidents() {
  return useQuery({
    queryKey: queryKeys.gis.accidents.list(),
    queryFn: getAllAccidentsGIS,
    staleTime: QUERY_STALE_TIME.SHORT,
  });
}

export function useGisAccident(id: string) {
  return useQuery({
    queryKey: queryKeys.gis.accidents.detail(id),
    queryFn: () => getAccidentByIdGIS(id),
    enabled: !!id,
    staleTime: QUERY_STALE_TIME.MEDIUM,
  });
}

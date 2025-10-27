import { useQuery } from '@tanstack/react-query';
import { getAllAccidents, getAccidentById } from '@/services/accidentsService';
import { queryKeys } from '@/config/queryKeys';
import { QUERY_STALE_TIME } from '@/config/queryConfig';

export function useAccidents() {
  return useQuery({
    queryKey: queryKeys.accidents.list(),
    queryFn: getAllAccidents,
    staleTime: QUERY_STALE_TIME.SHORT,
  });
}

export function useAccident(id: string) {
  return useQuery({
    queryKey: queryKeys.accidents.detail(id),
    queryFn: () => getAccidentById(id),
    enabled: !!id,
    staleTime: QUERY_STALE_TIME.MEDIUM,
  });
}

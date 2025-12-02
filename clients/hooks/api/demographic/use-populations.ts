import { useQuery } from '@tanstack/react-query';
import { getAllPopulations, getPopulationById } from '@/services';
import { queryKeys } from '@/config/queryKeys';
import { QUERY_STALE_TIME } from '@/config/queryConfig';

export function usePopulations(districtId?: string, year?: number) {
  return useQuery({
    queryKey: queryKeys.populations.list(districtId, year),
    queryFn: () => getAllPopulations(districtId, year),
    staleTime: QUERY_STALE_TIME.HOURLY,
  });
}

export function usePopulation(id: string) {
  return useQuery({
    queryKey: queryKeys.populations.detail(id),
    queryFn: () => getPopulationById(id),
    enabled: !!id,
    staleTime: QUERY_STALE_TIME.HOURLY,
  });
}



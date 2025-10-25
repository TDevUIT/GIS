import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllTraffics, getTrafficById, findIntersectingTraffics } from '@/services/trafficService';
import { queryKeys } from '@/config/queryKeys';
import { QUERY_STALE_TIME } from '@/config/queryConfig';

export function useTraffics(districtId?: string, roadName?: string) {
  return useQuery({
    queryKey: queryKeys.traffic.list(districtId, roadName),
    queryFn: () => getAllTraffics(districtId, roadName),
    staleTime: QUERY_STALE_TIME.SHORT,
  });
}

export function useTraffic(id: string) {
  return useQuery({
    queryKey: queryKeys.traffic.detail(id),
    queryFn: () => getTrafficById(id),
    enabled: !!id,
    staleTime: QUERY_STALE_TIME.SHORT,
  });
}

export function useTrafficIntersects() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (wkt: string) => findIntersectingTraffics(wkt),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.traffic.all });
    },
  });
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllPublicTransports, getPublicTransportById, findIntersectingPublicTransports } from '@/services';
import type { PublicTransportMode, PublicTransportQuery } from '@/interfaces/query/public-transport';
import { queryKeys } from '@/config/queryKeys';
import { QUERY_STALE_TIME } from '@/config/queryConfig';

export function usePublicTransports(districtId?: string, mode?: PublicTransportMode) {
  return useQuery({
    queryKey: queryKeys.publicTransports.list(districtId, mode),
    queryFn: () => getAllPublicTransports({ districtId, mode }),
    staleTime: QUERY_STALE_TIME.MEDIUM,
  });
}

export function usePublicTransport(id: string) {
  return useQuery({
    queryKey: queryKeys.publicTransports.detail(id),
    queryFn: () => getPublicTransportById(id),
    enabled: !!id,
    staleTime: QUERY_STALE_TIME.MEDIUM,
  });
}

export function usePublicTransportIntersects() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (wkt: string) => findIntersectingPublicTransports(wkt),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.publicTransports.all });
    },
  });
}



import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getAllPublicTransportsGIS, 
  getPublicTransportByIdGIS, 
  findIntersectingPublicTransportsGIS 
} from '@/services/gisPublicTransportsService';
import { queryKeys } from '@/config/queryKeys';
import { QUERY_STALE_TIME } from '@/config/queryConfig';

export function useGisPublicTransports(districtId?: string, mode?: string) {
  return useQuery({
    queryKey: queryKeys.gis.publicTransports.list(districtId, mode),
    queryFn: () => getAllPublicTransportsGIS(districtId, mode),
    staleTime: QUERY_STALE_TIME.MEDIUM,
  });
}

export function useGisPublicTransport(id: string) {
  return useQuery({
    queryKey: queryKeys.gis.publicTransports.detail(id),
    queryFn: () => getPublicTransportByIdGIS(id),
    enabled: !!id,
    staleTime: QUERY_STALE_TIME.MEDIUM,
  });
}

export function useGisPublicTransportIntersects() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (wkt: string) => findIntersectingPublicTransportsGIS(wkt),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.gis.publicTransports.lists() });
    },
  });
}

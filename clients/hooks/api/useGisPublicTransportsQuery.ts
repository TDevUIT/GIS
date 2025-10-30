import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getAllPublicTransportsGIS, 
  getPublicTransportByIdGIS, 
  findIntersectingPublicTransportsGIS 
} from '@/services/gisPublicTransportsService';
import { queryKeys } from '@/config/queryKeys';
import { QUERY_STALE_TIME } from '@/config/queryConfig';

type TransportMode = 'BUS' | 'METRO' | 'BRT' | 'WATERWAY';

interface PublicTransportQuery {
  districtId?: string;
  mode?: TransportMode;
}

export function useGisPublicTransports(query?: PublicTransportQuery) {
  return useQuery({
    queryKey: queryKeys.gis.publicTransports.list(query?.districtId, query?.mode),
    queryFn: () => getAllPublicTransportsGIS(query),
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

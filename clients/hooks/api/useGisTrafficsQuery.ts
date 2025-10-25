import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getAllTrafficsGIS, 
  getTrafficByIdGIS, 
  findIntersectingTrafficsGIS 
} from '@/services/gisTrafficsService';
import { queryKeys } from '@/config/queryKeys';
import { QUERY_STALE_TIME } from '@/config/queryConfig';

export function useGisTraffics(districtId?: string, roadName?: string) {
  return useQuery({
    queryKey: queryKeys.gis.traffics.list(districtId, roadName),
    queryFn: () => getAllTrafficsGIS(districtId, roadName),
    staleTime: QUERY_STALE_TIME.SHORT,
  });
}

export function useGisTraffic(id: string) {
  return useQuery({
    queryKey: queryKeys.gis.traffics.detail(id),
    queryFn: () => getTrafficByIdGIS(id),
    enabled: !!id,
    staleTime: QUERY_STALE_TIME.SHORT,
  });
}

export function useGisTrafficIntersects() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (wkt: string) => findIntersectingTrafficsGIS(wkt),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.gis.traffics.lists() });
    },
  });
}

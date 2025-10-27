import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getAllWardsGIS, 
  getWardByIdGIS, 
  getWardContainingPointGIS, 
  findIntersectingWardsGIS 
} from '@/services/gisWardsService';
import { queryKeys } from '@/config/queryKeys';
import { QUERY_STALE_TIME } from '@/config/queryConfig';

export function useGisWards(districtId?: string) {
  return useQuery({
    queryKey: queryKeys.gis.wards.list(districtId),
    queryFn: () => getAllWardsGIS(districtId),
    staleTime: QUERY_STALE_TIME.DAILY,
  });
}

export function useGisWard(id?: string) {
  return useQuery({
    queryKey: queryKeys.gis.wards.detail(id || 'none'),
    queryFn: () => {
      if (!id) throw new Error('Ward ID is required');
      return getWardByIdGIS(id);
    },
    enabled: !!id,
    staleTime: QUERY_STALE_TIME.DAILY,
  });
}

export function useGisWardContainingPoint(lng: number, lat: number, enabled = true) {
  return useQuery({
    queryKey: queryKeys.gis.wards.containsPoint(lng, lat),
    queryFn: () => getWardContainingPointGIS(lng, lat),
    enabled: enabled && !!lng && !!lat,
    staleTime: QUERY_STALE_TIME.LONG,
  });
}

export function useGisWardIntersects() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (wkt: string) => findIntersectingWardsGIS(wkt),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.gis.wards.lists() });
    },
  });
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllLandUses, getLandUseById, getLandUseAtPoint, findIntersectingLandUses } from '@/services/landUsesService';
import { queryKeys } from '@/config/queryKeys';
import { QUERY_STALE_TIME } from '@/config/queryConfig';

export function useLandUses(districtId?: string, type?: string) {
  return useQuery({
    queryKey: queryKeys.landUses.list(districtId, type),
    queryFn: () => getAllLandUses(districtId, type),
    staleTime: QUERY_STALE_TIME.HOURLY,
  });
}

export function useLandUse(id: string) {
  return useQuery({
    queryKey: queryKeys.landUses.detail(id),
    queryFn: () => getLandUseById(id),
    enabled: !!id,
    staleTime: QUERY_STALE_TIME.HOURLY,
  });
}

export function useLandUseAtPoint(lng: number, lat: number, enabled = true) {
  return useQuery({
    queryKey: queryKeys.landUses.atPoint(lng, lat),
    queryFn: () => getLandUseAtPoint(lng, lat),
    enabled: enabled && !!lng && !!lat,
    staleTime: QUERY_STALE_TIME.LONG,
  });
}

export function useLandUseIntersects() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (wkt: string) => findIntersectingLandUses(wkt),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.landUses.all });
    },
  });
}

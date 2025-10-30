import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllTerrains, getTerrainById, getTerrainAtPoint, findIntersectingTerrains } from '@/services/terrainsService';
import { queryKeys } from '@/config/queryKeys';
import { QUERY_STALE_TIME } from '@/config/queryConfig';

export function useTerrains(districtId?: string) {
  return useQuery({
    queryKey: queryKeys.terrains.list(districtId),
    queryFn: () => getAllTerrains(districtId),
    staleTime: QUERY_STALE_TIME.DAILY,
  });
}

export function useTerrain(id: string) {
  return useQuery({
    queryKey: queryKeys.terrains.detail(id),
    queryFn: () => getTerrainById(id),
    enabled: !!id,
    staleTime: QUERY_STALE_TIME.DAILY,
  });
}

export function useTerrainAtPoint(lng: number, lat: number, enabled = true) {
  return useQuery({
    queryKey: queryKeys.terrains.atPoint(lng, lat),
    queryFn: () => getTerrainAtPoint(lng, lat),
    enabled: enabled && !!lng && !!lat,
    staleTime: QUERY_STALE_TIME.LONG,
  });
}

export function useTerrainIntersects() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (wkt: string) => findIntersectingTerrains(wkt),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.terrains.all });
    },
  });
}

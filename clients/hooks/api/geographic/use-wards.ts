import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllWards, getWardById, getWardContainingPoint, findIntersectingWards } from '@/services';
import { queryKeys } from '@/config/queryKeys';
import { QUERY_STALE_TIME } from '@/config/queryConfig';

export function useWards(districtId?: string) {
  return useQuery({
    queryKey: queryKeys.wards.list(districtId),
    queryFn: () => getAllWards(districtId),
    staleTime: QUERY_STALE_TIME.DAILY,
  });
}

export function useWard(id: string) {
  return useQuery({
    queryKey: queryKeys.wards.detail(id),
    queryFn: () => getWardById(id),
    enabled: !!id,
    staleTime: QUERY_STALE_TIME.DAILY,
  });
}

export function useWardContainingPoint(lng: number, lat: number, enabled = true) {
  return useQuery({
    queryKey: queryKeys.wards.containsPoint(lng, lat),
    queryFn: () => getWardContainingPoint(lng, lat),
    enabled: enabled && !!lng && !!lat,
    staleTime: QUERY_STALE_TIME.LONG,
  });
}

export function useWardIntersects() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (wkt: string) => findIntersectingWards(wkt),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.wards.all });
    },
  });
}



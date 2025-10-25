import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllUrbanPlans, getUrbanPlanById, getUrbanPlanAtPoint, findIntersectingUrbanPlans } from '@/services/urbanPlansService';
import { queryKeys } from '@/config/queryKeys';
import { QUERY_STALE_TIME } from '@/config/queryConfig';

export function useUrbanPlans(districtId?: string, zoningType?: string) {
  return useQuery({
    queryKey: queryKeys.urbanPlans.list(districtId, zoningType),
    queryFn: () => getAllUrbanPlans({ districtId, zoningType }),
    staleTime: QUERY_STALE_TIME.HOURLY,
  });
}

export function useUrbanPlan(id: string) {
  return useQuery({
    queryKey: queryKeys.urbanPlans.detail(id),
    queryFn: () => getUrbanPlanById(id),
    enabled: !!id,
    staleTime: QUERY_STALE_TIME.HOURLY,
  });
}

export function useUrbanPlanAtPoint(lng: number, lat: number, enabled = true) {
  return useQuery({
    queryKey: queryKeys.urbanPlans.atPoint(lng, lat),
    queryFn: () => getUrbanPlanAtPoint(lng, lat),
    enabled: enabled && !!lng && !!lat,
    staleTime: QUERY_STALE_TIME.LONG,
  });
}

export function useUrbanPlanIntersects() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (wkt: string) => findIntersectingUrbanPlans(wkt),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.urbanPlans.all });
    },
  });
}

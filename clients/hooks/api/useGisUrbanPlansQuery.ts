import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getAllUrbanPlansGIS, 
  getUrbanPlanByIdGIS, 
  getUrbanPlanAtPointGIS, 
  findIntersectingUrbanPlansGIS 
} from '@/services/gisUrbanPlansService';
import { queryKeys } from '@/config/queryKeys';
import { QUERY_STALE_TIME } from '@/config/queryConfig';

export function useGisUrbanPlans(districtId?: string, zoningType?: string) {
  return useQuery({
    queryKey: queryKeys.gis.urbanPlans.list(districtId, zoningType),
    queryFn: () => getAllUrbanPlansGIS(districtId, zoningType),
    staleTime: QUERY_STALE_TIME.HOURLY,
  });
}

export function useGisUrbanPlan(id: string) {
  return useQuery({
    queryKey: queryKeys.gis.urbanPlans.detail(id),
    queryFn: () => getUrbanPlanByIdGIS(id),
    enabled: !!id,
    staleTime: QUERY_STALE_TIME.HOURLY,
  });
}

export function useGisUrbanPlanAtPoint(lng: number, lat: number, enabled = true) {
  return useQuery({
    queryKey: queryKeys.gis.urbanPlans.atPoint(lng, lat),
    queryFn: () => getUrbanPlanAtPointGIS(lng, lat),
    enabled: enabled && !!lng && !!lat,
    staleTime: QUERY_STALE_TIME.LONG,
  });
}

export function useGisUrbanPlanIntersects() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (wkt: string) => findIntersectingUrbanPlansGIS(wkt),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.gis.urbanPlans.lists() });
    },
  });
}

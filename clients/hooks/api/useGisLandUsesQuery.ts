import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getAllLandUsesGIS, 
  getLandUseByIdGIS, 
  getLandUseAtPointGIS, 
  findIntersectingLandUsesGIS 
} from '@/services/gisLandUsesService';
import { queryKeys } from '@/config/queryKeys';
import { QUERY_STALE_TIME } from '@/config/queryConfig';

export function useGisLandUses(districtId?: string, type?: string) {
  return useQuery({
    queryKey: queryKeys.gis.landUses.list(districtId, type),
    queryFn: () => getAllLandUsesGIS(districtId, type),
    staleTime: QUERY_STALE_TIME.HOURLY,
  });
}

export function useGisLandUse(id: string) {
  return useQuery({
    queryKey: queryKeys.gis.landUses.detail(id),
    queryFn: () => getLandUseByIdGIS(id),
    enabled: !!id,
    staleTime: QUERY_STALE_TIME.HOURLY,
  });
}

export function useGisLandUseAtPoint(lng: number, lat: number, enabled = true) {
  return useQuery({
    queryKey: queryKeys.gis.landUses.atPoint(lng, lat),
    queryFn: () => getLandUseAtPointGIS(lng, lat),
    enabled: enabled && !!lng && !!lat,
    staleTime: QUERY_STALE_TIME.LONG,
  });
}

export function useGisLandUseIntersects() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (wkt: string) => findIntersectingLandUsesGIS(wkt),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.gis.landUses.lists() });
    },
  });
}

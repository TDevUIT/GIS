import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getAllTerrainsGIS, 
  getTerrainByIdGIS, 
  getTerrainAtPointGIS, 
  findIntersectingTerrainsGIS 
} from '@/services/gisTerrainsService';
import { queryKeys } from '@/config/queryKeys';
import { QUERY_STALE_TIME } from '@/config/queryConfig';

export function useGisTerrains(districtId?: string) {
  return useQuery({
    queryKey: queryKeys.gis.terrains.list(districtId),
    queryFn: () => getAllTerrainsGIS(districtId),
    staleTime: QUERY_STALE_TIME.DAILY,
  });
}

export function useGisTerrain(id: string) {
  return useQuery({
    queryKey: queryKeys.gis.terrains.detail(id),
    queryFn: () => getTerrainByIdGIS(id),
    enabled: !!id,
    staleTime: QUERY_STALE_TIME.DAILY,
  });
}

export function useGisTerrainAtPoint(lng: number, lat: number, enabled = true) {
  return useQuery({
    queryKey: queryKeys.gis.terrains.atPoint(lng, lat),
    queryFn: () => getTerrainAtPointGIS(lng, lat),
    enabled: enabled && !!lng && !!lat,
    staleTime: QUERY_STALE_TIME.LONG,
  });
}

export function useGisTerrainIntersects() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (wkt: string) => findIntersectingTerrainsGIS(wkt),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.gis.terrains.lists() });
    },
  });
}

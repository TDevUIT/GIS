import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getAllDistrictsGIS, 
  getDistrictByIdGIS, 
  getDistrictContainingPointGIS, 
  findIntersectingDistrictsGIS,
  getWardsOfDistrictGIS 
} from '@/services/gisDistrictsService';
import { queryKeys } from '@/config/queryKeys';
import { QUERY_STALE_TIME } from '@/config/queryConfig';

export function useGisDistricts() {
  return useQuery({
    queryKey: queryKeys.gis.districts.list(),
    queryFn: getAllDistrictsGIS,
    staleTime: QUERY_STALE_TIME.DAILY,
  });
}

export function useGisDistrict(id?: string) {
  return useQuery({
    queryKey: queryKeys.gis.districts.detail(id || 'none'),
    queryFn: () => {
      if (!id) throw new Error('District ID is required');
      return getDistrictByIdGIS(id);
    },
    enabled: !!id,
    staleTime: QUERY_STALE_TIME.DAILY,
  });
}

export function useGisDistrictContainingPoint(lng: number, lat: number, enabled = true) {
  return useQuery({
    queryKey: queryKeys.gis.districts.containsPoint(lng, lat),
    queryFn: () => getDistrictContainingPointGIS(lng, lat),
    enabled: enabled && !!lng && !!lat,
    staleTime: QUERY_STALE_TIME.LONG,
  });
}

export function useGisDistrictIntersects() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (wkt: string) => findIntersectingDistrictsGIS(wkt),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.gis.districts.lists() });
    },
  });
}

export function useGisDistrictWards(districtId?: string) {
  return useQuery({
    queryKey: queryKeys.gis.districts.wards(districtId || 'none'),
    queryFn: () => {
      if (!districtId) throw new Error('District ID is required');
      return getWardsOfDistrictGIS(districtId);
    },
    enabled: !!districtId,
    staleTime: QUERY_STALE_TIME.DAILY,
  });
}

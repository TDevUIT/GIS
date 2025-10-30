import { useQuery } from '@tanstack/react-query';
import { 
  getAllInfrastructuresGIS, 
  getInfrastructureByIdGIS, 
  getInfrastructuresWithinRadiusGIS,
  InfraCategory
} from '@/services/gisInfrastructuresService';
import { queryKeys } from '@/config/queryKeys';
import { QUERY_STALE_TIME } from '@/config/queryConfig';

export function useGisInfrastructures(districtId?: string, category?: InfraCategory) {
  return useQuery({
    queryKey: queryKeys.gis.infrastructures.list(districtId, category),
    queryFn: () => getAllInfrastructuresGIS(districtId, category),
    staleTime: QUERY_STALE_TIME.HOURLY,
  });
}

export function useGisInfrastructure(id: string) {
  return useQuery({
    queryKey: queryKeys.gis.infrastructures.detail(id),
    queryFn: () => getInfrastructureByIdGIS(id),
    enabled: !!id,
    staleTime: QUERY_STALE_TIME.HOURLY,
  });
}

export function useGisInfrastructuresWithinRadius(
  lng: number,
  lat: number,
  radiusInMeters: number,
  enabled = true
) {
  return useQuery({
    queryKey: queryKeys.gis.infrastructures.withinRadius(lng, lat, radiusInMeters),
    queryFn: () => getInfrastructuresWithinRadiusGIS(lng, lat, radiusInMeters),
    enabled: enabled && !!lng && !!lat && radiusInMeters > 0,
    staleTime: QUERY_STALE_TIME.LONG,
  });
}

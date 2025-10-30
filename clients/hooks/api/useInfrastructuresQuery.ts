import { useQuery } from '@tanstack/react-query';
import { getAllInfrastructures, getInfrastructureById, getInfrastructuresWithinRadius } from '@/services/infrastructuresService';
import { queryKeys } from '@/config/queryKeys';
import { QUERY_STALE_TIME } from '@/config/queryConfig';

export function useInfrastructures(districtId?: string, category?: string) {
  return useQuery({
    queryKey: queryKeys.infrastructures.list(districtId, category),
    queryFn: () => getAllInfrastructures(districtId, category),
    staleTime: QUERY_STALE_TIME.HOURLY,
  });
}

export function useInfrastructure(id: string) {
  return useQuery({
    queryKey: queryKeys.infrastructures.detail(id),
    queryFn: () => getInfrastructureById(id),
    enabled: !!id,
    staleTime: QUERY_STALE_TIME.HOURLY,
  });
}

export function useInfrastructuresWithinRadius(
  lng: number,
  lat: number,
  radiusInMeters: number,
  enabled = true
) {
  return useQuery({
    queryKey: queryKeys.infrastructures.withinRadius(lng, lat, radiusInMeters),
    queryFn: () => getInfrastructuresWithinRadius(lng, lat, radiusInMeters),
    enabled: enabled && !!lng && !!lat && radiusInMeters > 0,
    staleTime: QUERY_STALE_TIME.LONG,
  });
}

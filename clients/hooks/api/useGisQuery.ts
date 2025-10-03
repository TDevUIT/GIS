import { useQuery } from '@tanstack/react-query';
import { getDistricts, getWards, getMapLayers, getLocationData, searchLocations } from '../../services/gisService';
import { queryKeys } from '../../config/queryKeys';
import { QUERY_CONFIG } from '../../config/queryConfig';

export function useDistricts() {
  return useQuery({
    queryKey: queryKeys.gis.districts(),
    queryFn: () => getDistricts(),
    staleTime: QUERY_CONFIG.gis.districts.staleTime,
  });
}

export function useWards(districtId: string) {
  return useQuery({
    queryKey: queryKeys.gis.wards(districtId),
    queryFn: () => getWards(districtId),
    enabled: !!districtId,
    staleTime: QUERY_CONFIG.gis.wards.staleTime,
  });
}

export function useMapLayers() {
  return useQuery({
    queryKey: queryKeys.gis.layers(),
    queryFn: () => getMapLayers(),
    staleTime: QUERY_CONFIG.gis.layers.staleTime,
  });
}

export function useLocationData(lat: number, lng: number) {
  return useQuery({
    queryKey: queryKeys.gis.location(lat, lng),
    queryFn: () => getLocationData(lat, lng),
    enabled: !!(lat && lng),
    staleTime: QUERY_CONFIG.gis.location.staleTime,
  });
}

export function useLocationSearch(query: string) {
  return useQuery({
    queryKey: queryKeys.gis.search(query),
    queryFn: () => searchLocations(query),
    enabled: query.length >= 2,
    staleTime: QUERY_CONFIG.gis.search.staleTime,
  });
}

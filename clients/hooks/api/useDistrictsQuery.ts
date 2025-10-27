import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllDistricts, getDistrictById, getDistrictContainingPoint, findIntersectingDistricts, getWardsOfDistrict, createDistrict, updateDistrict, deleteDistrict } from '@/services/districtsService';
import { queryKeys } from '@/config/queryKeys';
import { QUERY_STALE_TIME } from '@/config/queryConfig';

export function useDistricts() {
  return useQuery({
    queryKey: queryKeys.districts.list(),
    queryFn: getAllDistricts,
    staleTime: QUERY_STALE_TIME.DAILY,
  });
}

export function useDistrict(id: string) {
  return useQuery({
    queryKey: queryKeys.districts.detail(id),
    queryFn: () => getDistrictById(id),
    enabled: !!id,
    staleTime: QUERY_STALE_TIME.DAILY,
  });
}

export function useDistrictContainingPoint(lng: number, lat: number, enabled = true) {
  return useQuery({
    queryKey: queryKeys.districts.containsPoint(lng, lat),
    queryFn: () => getDistrictContainingPoint(lng, lat),
    enabled: enabled && !!lng && !!lat,
    staleTime: QUERY_STALE_TIME.LONG,
  });
}

export function useDistrictIntersects() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (wkt: string) => findIntersectingDistricts(wkt),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.districts.all });
    },
  });
}

export function useDistrictWards(districtId: string) {
  return useQuery({
    queryKey: queryKeys.districts.wards(districtId),
    queryFn: () => getWardsOfDistrict(districtId),
    enabled: !!districtId,
    staleTime: QUERY_STALE_TIME.DAILY,
  });
}

export function useCreateDistrict() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => createDistrict(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.districts.lists() });
    },
  });
}

export function useUpdateDistrict() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateDistrict(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.districts.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.districts.lists() });
    },
  });
}

export function useDeleteDistrict() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteDistrict(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.districts.lists() });
    },
  });
}

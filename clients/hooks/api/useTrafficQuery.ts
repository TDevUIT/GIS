import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTrafficData, getTrafficIncidents, getTrafficAnalytics, reportTrafficIncident } from '../../services/trafficService';
import { queryKeys } from '../../config/queryKeys';
import { QUERY_CONFIG } from '../../config/queryConfig';
import { TrafficData, Incident } from '../../types';

export function useTrafficData(districtId?: string) {
  return useQuery({
    queryKey: queryKeys.traffic.list(districtId || ''),
    queryFn: () => getTrafficData(districtId),
    enabled: true,
    staleTime: QUERY_CONFIG.traffic.data.staleTime,
  });
}

export function useTrafficIncidents() {
  return useQuery({
    queryKey: queryKeys.traffic.incidents(),
    queryFn: () => getTrafficIncidents(),
    refetchInterval: QUERY_CONFIG.traffic.incidents.refetchInterval,
  });
}

export function useTrafficAnalytics(dateRange: string) {
  return useQuery({
    queryKey: queryKeys.traffic.analytics(dateRange),
    queryFn: () => getTrafficAnalytics(dateRange),
    enabled: !!dateRange,
    staleTime: QUERY_CONFIG.traffic.analytics.staleTime,
  });
}

export function useReportIncident() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (incident: Partial<Incident>) => reportTrafficIncident(incident),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.traffic.incidents() });
      queryClient.invalidateQueries({ queryKey: queryKeys.traffic.all });
      console.log('✅ Traffic incident reported successfully');
    },
    onError: (error) => {
      console.error('❌ Failed to report traffic incident:', error);
    },
  });
}

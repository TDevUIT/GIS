import { useQuery } from '@tanstack/react-query';
import { getAirQualityData, getAirQualityHistory, getAirQualityAlerts, getAirQualityForecast } from '../../services/airQualityService';
import { queryKeys } from '../../config/queryKeys';
import { QUERY_CONFIG } from '../../config/queryConfig';
import { AirQualityData } from '../../types';

export function useAirQualityData(districtId?: string) {
  return useQuery({
    queryKey: queryKeys.airQuality.list(districtId),
    queryFn: () => getAirQualityData(districtId),
    staleTime: QUERY_CONFIG.airQuality.data.staleTime,
  });
}

export function useAirQualityHistory(dateRange: string) {
  return useQuery({
    queryKey: queryKeys.airQuality.history(dateRange),
    queryFn: () => getAirQualityHistory(dateRange),
    enabled: !!dateRange,
    staleTime: QUERY_CONFIG.airQuality.history.staleTime,
  });
}

export function useAirQualityAlerts() {
  return useQuery({
    queryKey: queryKeys.airQuality.alerts(),
    queryFn: () => getAirQualityAlerts(),
    refetchInterval: QUERY_CONFIG.airQuality.alerts.refetchInterval,
    staleTime: QUERY_CONFIG.airQuality.alerts.staleTime,
  });
}

export function useAirQualityForecast(days: number = 7) {
  return useQuery({
    queryKey: queryKeys.airQuality.forecast(days),
    queryFn: () => getAirQualityForecast(days),
    staleTime: QUERY_CONFIG.airQuality.forecast.staleTime,
  });
}

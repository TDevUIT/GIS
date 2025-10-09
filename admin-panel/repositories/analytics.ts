import { ofetch } from 'ofetch';
import type {
    GlobalSummary,
    InfrastructureByCategory,
    PopulationHistoryPoint,
    LandUseSummary,
    AirQualityHistoryPoint,
    AccidentSummaryBySeverity,
    GetLandUseSummaryQuery,
    RecentActivity,
    WaterQualityHistoryPoint,
} from '../types/api/analytics';

type OFetch = typeof ofetch;
type ApiResponse<T> = { data: T };

export default (apiFetch: OFetch) => ({
    getGlobalSummary() {
        return apiFetch<ApiResponse<GlobalSummary>>('/analytics/summary', {
            method: 'GET',
        });
    },

    getInfrastructureByCategory() {
        return apiFetch<ApiResponse<InfrastructureByCategory[]>>('/analytics/infrastructure-by-category', {
            method: 'GET',
        });
    },

    getPopulationHistory(districtId: string) {
        return apiFetch<ApiResponse<PopulationHistoryPoint[]>>(`/analytics/population-history/${districtId}`, {
            method: 'GET',
        });
    },

    getLandUseSummary(params: GetLandUseSummaryQuery) {
        return apiFetch<ApiResponse<LandUseSummary>>('/analytics/land-use-summary', {
            method: 'GET',
            query: params,
        });
    },

    getAirQualityHistory(districtId: string) {
        return apiFetch<ApiResponse<AirQualityHistoryPoint[]>>(`/analytics/air-quality-history/${districtId}`, {
            method: 'GET',
        });
    },

    getAccidentSummaryBySeverity() {
        return apiFetch<ApiResponse<AccidentSummaryBySeverity[]>>('/analytics/accident-summary-by-severity', {
            method: 'GET',
        });
    },

    getWaterQualityHistory(districtId: string) {
    return apiFetch<ApiResponse<WaterQualityHistoryPoint[]>>(`/analytics/water-quality-history/${districtId}`, {
      method: 'GET',
    });
    },

    getRecentActivities() {
    return apiFetch<ApiResponse<RecentActivity[]>>('/analytics/recent-activities', {
      method: 'GET',
    });
  },
});

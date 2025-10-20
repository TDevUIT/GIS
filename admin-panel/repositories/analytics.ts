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
    DemographicsSummaryPoint,
    HouseholdsSummary,
    AccidentsByTimeOfDay,
    AccidentHotspot,
    TrafficRisk,
    AccidentsByDayOfWeek,
    PublicTransportSummaryByMode,
    PublicTransportCapacityByMode,
    MostFrequentRoute,
    AirQualityRanking,
    WaterQualityRanking,
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

    getDemographicsSummary(populationId: string) {
        return apiFetch<ApiResponse<DemographicsSummaryPoint[]>>(`/analytics/demographics-summary/${populationId}`, {
            method: 'GET',
        });
    },

    getHouseholdsSummary(populationId: string) {
        return apiFetch<ApiResponse<HouseholdsSummary>>(`/analytics/households-summary/${populationId}`, {
            method: 'GET',
        });
    },

    getAccidentHotspots() {
        return apiFetch<ApiResponse<AccidentHotspot[]>>('/analytics/accident-hotspots', {
            method: 'GET',
        });
    },

    getAccidentsByTimeOfDay() {
        return apiFetch<ApiResponse<AccidentsByTimeOfDay[]>>('/analytics/accidents-by-time-of-day', {
            method: 'GET',
        });
    },

    getAccidentsByDayOfWeek() {
        return apiFetch<ApiResponse<AccidentsByDayOfWeek[]>>('/analytics/accidents-by-day-of-week', {
            method: 'GET',
        });
    },

    getTrafficRiskAssessment() {
        return apiFetch<ApiResponse<TrafficRisk[]>>('/analytics/traffic-risk-assessment', {
            method: 'GET',
        });
    },

    getPublicTransportSummaryByMode() {
        return apiFetch<ApiResponse<PublicTransportSummaryByMode[]>>('/analytics/public-transport-summary-by-mode', {
            method: 'GET',
        });
    },

    getPublicTransportCapacityByMode() {
        return apiFetch<ApiResponse<PublicTransportCapacityByMode[]>>('/analytics/public-transport-capacity-by-mode', {
            method: 'GET',
        });
    },

    getMostFrequentRoutes() {
        return apiFetch<ApiResponse<MostFrequentRoute[]>>('/analytics/most-frequent-routes', {
            method: 'GET',
        });
    },

    getAirQualityRankingByDistrict() {
        return apiFetch<ApiResponse<AirQualityRanking[]>>('/analytics/air-quality-ranking-by-district', {
            method: 'GET',
        });
    },

    getWaterQualityRankingByDistrict() {
        return apiFetch<ApiResponse<WaterQualityRanking[]>>('/analytics/water-quality-ranking-by-district', {
            method: 'GET',
        });
    },
});

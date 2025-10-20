import { InfraCategory, AccidentSeverity, TransportMode } from './shared';

export interface GlobalSummary {
    totalDistricts: number;
    totalInfrastructures: number;
    totalTrafficRoutes: number;
    totalUrbanPlans: number;
    latestPopulationData: {
        year: number | null;
        total: number;
    };
}

export interface InfrastructureByCategory {
    category: InfraCategory;
    count: number;
}

export interface PopulationHistoryPoint {
    year: number;
    populationTotal: number;
    householdsTotal: number;
}

export interface LandUseSummary {
    year: number | null;
    summary: {
        type: string;
        totalAreaKm2: number;
    }[];
}

export interface AirQualityHistoryPoint {
    day: string;
    avgPm25: number;
    avgCo2: number;
}

export interface AccidentSummaryBySeverity {
    severity: AccidentSeverity;
    count: number;
}

export interface GetLandUseSummaryQuery {
    districtId: string;
    year?: number;
}

export interface WaterQualityHistoryPoint {
    day: string;
    avgPh: number;
    avgTurbidity: number;
}

export interface RecentActivity {
    type: 'INFRASTRUCTURE' | 'ACCIDENT';
    id: string;
    name?: string;
    category?: string;
    severity?: AccidentSeverity;
    createdAt: string;
}

export interface DemographicsSummaryPoint {
    ageGroup: string;
    male: number;
    female: number;
}

export interface HouseholdsSummary {
    byHousingType: {
        housingType: string;
        count: number;
    }[];
    byIncomeLevel: {
        incomeLevel: string;
        count: number;
    }[];
}

export interface AccidentHotspot {
    id: string;
    roadName: string;
    districtName: string;
    accidentCount: number;
}

export interface AccidentsByTimeOfDay {
    timeOfDay: 'Morning (6-12h)' | 'Afternoon (12-17h)' | 'Evening (17-21h)' | 'Night (21-6h)';
    accidentCount: number;
}

export interface AccidentsByDayOfWeek {
    dayOfWeek: string;
    accidentCount: number;
}

export interface TrafficRisk {
    id: string;
    roadName: string;
    districtName: string;
    recency: number;
    frequency: number;
    magnitude: number;
    riskScore: number;
}
export interface PublicTransportSummaryByMode {
    mode: TransportMode;
    routeCount: number;
}

export interface PublicTransportCapacityByMode {
    mode: TransportMode;
    totalCapacity: number;
}

export interface MostFrequentRoute {
    routeName: string;
    mode: TransportMode;
    frequencyMin: number;
    districtName: string;
}

export interface AirQualityRanking {
    districtName: string;
    districtCode: string;
    avgPm25: number;
}

export interface WaterQualityRanking {
    districtName: string;
    districtCode: string;
    avgContaminationIndex: number;
}

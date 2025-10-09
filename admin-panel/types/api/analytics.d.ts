import { InfraCategory } from './shared';

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
    severity: string;
    count: number;
}

export interface GetLandUseSummaryQuery {
    districtId: string;
    year?: number;
}
export interface WaterQualityHistoryPoint {
  month: string;
  avgPh: number;
  avgTurbidity: number;
}
export interface RecentActivity {
  type: 'INFRASTRUCTURE' | 'ACCIDENT';
  id: string;
  name?: string;
  category?: string;
  severity?: string;
  createdAt: string;
}

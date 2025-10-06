import type { GeoJSONPolygon } from './shared';

export interface UrbanPlan {
    id: string;
    planName: string;
    zoningType: string;
    description: string | null;
    issuedDate: string;
    createdAt: string;
    updatedAt: string;
    geom: GeoJSONPolygon | null;
    districtId: string;
    districtName?: string;
}

export type CreateUrbanPlanDTO = Omit<UrbanPlan, 'id' | 'createdAt' | 'updatedAt' | 'geom' | 'districtName'> & { geom: string };

export type UpdateUrbanPlanDTO = Partial<CreateUrbanPlanDTO>;

export interface FindUrbanPlansQuery {
    districtId?: string;
    zoningType?: string;
}

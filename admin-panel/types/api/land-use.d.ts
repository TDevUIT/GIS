import type { GeoJSONPolygon } from './shared';

export interface LandUse {
    id: string;
    type: string;
    areaKm2: number;
    year: number;
    createdAt: string;
    updatedAt: string;
    geom: GeoJSONPolygon | null;
    districtId: string;
    districtName?: string;
}

export type CreateLandUseDTO = Omit<
    LandUse,
    'id' | 'createdAt' | 'updatedAt' | 'geom' | 'districtName'
> & { geom: string };

export type UpdateLandUseDTO = Partial<CreateLandUseDTO>;

export interface FindLandUsesQuery {
    districtId?: string;
    type?: string;
}

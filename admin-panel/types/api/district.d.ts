import type { GeoJSONPolygon } from './shared';

export interface District {
    id: string;
    code: string;
    name: string;
    areaKm2: number | null;
    densityPerKm2: number | null;
    createdAt: string;
    updatedAt: string;
    geom: GeoJSONPolygon | null;
}

export type CreateDistrictDTO = Omit<District, 'id' | 'createdAt' | 'updatedAt' | 'geom'> & { geom: string };

export type UpdateDistrictDTO = Partial<CreateDistrictDTO>;

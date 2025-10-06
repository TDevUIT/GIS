import type { GeoJSONPolygon } from './shared';

export interface Ward {
    id: string;
    name: string;
    code: string;
    createdAt: string;
    updatedAt: string;
    districtId: string;
    districtName?: string;
    geom: GeoJSONPolygon | null;
}

export type CreateWardDTO = Omit<Ward, 'id' | 'createdAt' | 'updatedAt' | 'geom' | 'districtName'> & { geom: string };
export type UpdateWardDTO = Partial<CreateWardDTO>;

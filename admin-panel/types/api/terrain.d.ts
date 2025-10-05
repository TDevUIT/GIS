import type { GeoJSONPolygon } from './shared';

export interface Terrain {
    id: string;
    elevation: number | null;
    slope: number | null;
    soilType: string | null;
    createdAt: string;
    updatedAt: string;
    geom: GeoJSONPolygon | null;
    districtId: string;
    districtName?: string;
}

export type CreateTerrainDTO = Omit<Terrain, 'id' | 'createdAt' | 'updatedAt' | 'geom' | 'districtName'> & { geom: string };

export type UpdateTerrainDTO = Partial<CreateTerrainDTO>;

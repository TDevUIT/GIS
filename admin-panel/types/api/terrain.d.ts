import type { GeoJSONPolygon } from './shared';

export type ElevationCategory = 'VERY_LOW' | 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH' | 'UNKNOWN';

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
    elevationCategory?: ElevationCategory;
}

export type CreateTerrainDTO = Omit<Terrain, 'id' | 'createdAt' | 'updatedAt' | 'geom' | 'districtName' | 'elevationCategory'> & { geom: string };

export type UpdateTerrainDTO = Partial<CreateTerrainDTO>;

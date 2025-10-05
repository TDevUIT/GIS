import { ofetch } from 'ofetch';
import type { Terrain, CreateTerrainDTO, UpdateTerrainDTO } from '../types/api/terrain';

type OFetch = typeof ofetch;
type ApiResponse<T> = { data: T };

export default (apiFetch: OFetch) => ({
    getAll(params?: { districtId?: string }) {
        return apiFetch<ApiResponse<Terrain[]>>('/terrains', {
            method: 'GET',
            query: params,
        });
    },

    getById(id: string) {
        return apiFetch<ApiResponse<Terrain>>(`/terrains/${id}`, {
            method: 'GET',
        });
    },

    create(body: CreateTerrainDTO) {
        return apiFetch<ApiResponse<Terrain>>('/terrains', {
            method: 'POST',
            body,
        });
    },

    update(id: string, body: UpdateTerrainDTO) {
        return apiFetch<ApiResponse<Terrain>>(`/terrains/${id}`, {
            method: 'PATCH',
            body,
        });
    },

    remove(id: string) {
        return apiFetch(`/terrains/${id}`, {
            method: 'DELETE',
        });
    },

    findAtPoint(lng: number, lat: number) {
        return apiFetch<ApiResponse<Terrain | null>>('/terrains/at-point', {
            method: 'GET',
            query: { lng, lat },
        });
    },

    findIntersecting(wkt: string) {
        return apiFetch<ApiResponse<Terrain[]>>('/terrains/intersects-with', {
            method: 'POST',
            body: { wkt },
        });
    },
});

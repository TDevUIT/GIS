import { ofetch } from 'ofetch';
import type { LandUse, CreateLandUseDTO, UpdateLandUseDTO, FindLandUsesQuery } from '../types/api/land-use';

type OFetch = typeof ofetch;
type ApiResponse<T> = { data: T };

export default (apiFetch: OFetch) => ({
    getAll(params?: FindLandUsesQuery) {
        return apiFetch<ApiResponse<LandUse[]>>('/land-uses', {
            method: 'GET',
            query: params,
        });
    },

    getById(id: string) {
        return apiFetch<ApiResponse<LandUse>>(`/land-uses/${id}`, {
            method: 'GET',
        });
    },

    create(body: CreateLandUseDTO) {
        return apiFetch<ApiResponse<LandUse>>('/land-uses', {
            method: 'POST',
            body,
        });
    },

    update(id: string, body: UpdateLandUseDTO) {
        return apiFetch<ApiResponse<LandUse>>(`/land-uses/${id}`, {
            method: 'PATCH',
            body,
        });
    },

    remove(id: string) {
        return apiFetch(`/land-uses/${id}`, {
            method: 'DELETE',
        });
    },

    findAtPoint(lng: number, lat: number) {
        return apiFetch<ApiResponse<LandUse | null>>('/land-uses/at-point', {
            method: 'GET',
            query: { lng, lat },
        });
    },

    findIntersecting(wkt: string) {
        return apiFetch<ApiResponse<LandUse[]>>('/land-uses/intersects-with', {
            method: 'POST',
            body: { wkt },
        });
    },
});

import { ofetch } from 'ofetch';
import type { Traffic, CreateTrafficDTO, UpdateTrafficDTO, FindTrafficsQuery } from '../types/api/traffic';

type OFetch = typeof ofetch;
type ApiResponse<T> = { data: T };

export default (apiFetch: OFetch) => ({
    getAll(params?: FindTrafficsQuery) {
        return apiFetch<ApiResponse<Traffic[]>>('/traffics', {
            method: 'GET',
            query: params,
        });
    },

    getById(id: string) {
        return apiFetch<ApiResponse<Traffic>>(`/traffics/${id}`, {
            method: 'GET',
        });
    },

    create(body: CreateTrafficDTO) {
        return apiFetch<ApiResponse<Traffic>>('/traffics', {
            method: 'POST',
            body,
        });
    },

    update(id: string, body: UpdateTrafficDTO) {
        return apiFetch<ApiResponse<Traffic>>(`/traffics/${id}`, {
            method: 'PATCH',
            body,
        });
    },

    remove(id: string) {
        return apiFetch(`/traffics/${id}`, {
            method: 'DELETE',
        });
    },

    findIntersecting(wkt: string) {
        return apiFetch<ApiResponse<Traffic[]>>('/traffics/intersects-with', {
            method: 'POST',
            body: { wkt },
        });
    },
});

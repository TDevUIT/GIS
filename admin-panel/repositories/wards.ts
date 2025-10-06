import { ofetch } from 'ofetch';
import type { Ward, CreateWardDTO, UpdateWardDTO } from '../types/api/ward';

type OFetch = typeof ofetch;
type ApiResponse<T> = { data: T };

export default (apiFetch: OFetch) => ({
    getAll(params?: { districtId?: string }) {
        return apiFetch<ApiResponse<Ward[]>>('/wards', {
            method: 'GET',
            query: params,
        });
    },

    getById(id: string) {
        return apiFetch<ApiResponse<Ward>>(`/wards/${id}`, {
            method: 'GET',
        });
    },

    create(body: CreateWardDTO) {
        return apiFetch<ApiResponse<Ward>>('/wards', {
            method: 'POST',
            body,
        });
    },

    update(id: string, body: UpdateWardDTO) {
        return apiFetch<ApiResponse<Ward>>(`/wards/${id}`, {
            method: 'PATCH',
            body,
        });
    },

    remove(id: string) {
        return apiFetch(`/wards/${id}`, {
            method: 'DELETE',
        });
    },

    findContainingPoint(lng: number, lat: number) {
        return apiFetch<ApiResponse<Ward | null>>('/wards/contains-point', {
            method: 'GET',
            query: { lng, lat },
        });
    },
});

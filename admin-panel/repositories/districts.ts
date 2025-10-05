import { ofetch } from 'ofetch';
import type { District, CreateDistrictDTO, UpdateDistrictDTO } from '../types/api/district';
import type { Ward } from '../types/api/ward';

type OFetch = typeof ofetch;
type ApiResponse<T> = { data: T };

export default (apiFetch: OFetch) => ({
    getAll() {
        return apiFetch<ApiResponse<District[]>>('/districts', { method: 'GET' });
    },
    getById(id: string) {
        return apiFetch<ApiResponse<District>>(`/districts/${id}`, { method: 'GET' });
    },
    getWardsOfDistrict(districtId: string) {
        return apiFetch<ApiResponse<Ward[]>>(`/districts/${districtId}/wards`, { method: 'GET' });
    },
    create(body: CreateDistrictDTO) {
        return apiFetch<ApiResponse<District>>('/districts', { method: 'POST', body });
    },
    update(id: string, body: UpdateDistrictDTO) {
        return apiFetch<ApiResponse<District>>(`/districts/${id}`, { method: 'PATCH', body });
    },
    remove(id: string) {
        return apiFetch(`/districts/${id}`, { method: 'DELETE' });
    },
    findContainingPoint(lng: number, lat: number) {
        return apiFetch<ApiResponse<District | null>>('/districts/contains-point', {
            method: 'GET',
            query: { lng, lat },
        });
    },
    findIntersecting(wkt: string) {
        return apiFetch<ApiResponse<District[]>>('/districts/intersects-with', {
            method: 'POST',
            body: { wkt },
        });
    },
});

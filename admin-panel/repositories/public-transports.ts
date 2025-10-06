import { ofetch } from 'ofetch';
import type { PublicTransport, CreatePublicTransportDTO, UpdatePublicTransportDTO, FindPublicTransportsQuery } from '../types/api/public-transport';

type OFetch = typeof ofetch;
type ApiResponse<T> = { data: T };

export default (apiFetch: OFetch) => ({
    getAll(params?: FindPublicTransportsQuery) {
        return apiFetch<ApiResponse<PublicTransport[]>>('/public-transports', {
            method: 'GET',
            query: params,
        });
    },

    getById(id: string) {
        return apiFetch<ApiResponse<PublicTransport>>(`/public-transports/${id}`, {
            method: 'GET',
        });
    },

    create(body: CreatePublicTransportDTO) {
        return apiFetch<ApiResponse<PublicTransport>>('/public-transports', {
            method: 'POST',
            body,
        });
    },

    update(id: string, body: UpdatePublicTransportDTO) {
        return apiFetch<ApiResponse<PublicTransport>>(`/public-transports/${id}`, {
            method: 'PATCH',
            body,
        });
    },

    remove(id: string) {
        return apiFetch(`/public-transports/${id}`, {
            method: 'DELETE',
        });
    },

    findIntersecting(wkt: string) {
        return apiFetch<ApiResponse<PublicTransport[]>>('/public-transports/intersects-with', {
            method: 'POST',
            body: { wkt },
        });
    },
});

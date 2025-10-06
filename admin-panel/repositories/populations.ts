import { ofetch } from 'ofetch';
import type { Population, CreatePopulationDTO, UpdatePopulationDTO, FindPopulationsQuery } from '../types/api/population';

type OFetch = typeof ofetch;
type ApiResponse<T> = { data: T };

export default (apiFetch: OFetch) => ({
    getAll(params?: FindPopulationsQuery) {
        return apiFetch<ApiResponse<Population[]>>('/populations', {
            method: 'GET',
            query: params,
        });
    },

    getById(id: string) {
        return apiFetch<ApiResponse<Population>>(`/populations/${id}`, {
            method: 'GET',
        });
    },

    create(body: CreatePopulationDTO) {
        return apiFetch<ApiResponse<Population>>('/populations', {
            method: 'POST',
            body,
        });
    },

    update(id: string, body: UpdatePopulationDTO) {
        return apiFetch<ApiResponse<Population>>(`/populations/${id}`, {
            method: 'PATCH',
            body,
        });
    },

    remove(id: string) {
        return apiFetch(`/populations/${id}`, {
            method: 'DELETE',
        });
    },
});

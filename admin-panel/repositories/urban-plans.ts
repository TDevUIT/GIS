import { ofetch } from 'ofetch';
import type { UrbanPlan, CreateUrbanPlanDTO, UpdateUrbanPlanDTO, FindUrbanPlansQuery } from '../types/api/urban-plan';

type OFetch = typeof ofetch;
type ApiResponse<T> = { data: T };

export default (apiFetch: OFetch) => ({
    getAll(params?: FindUrbanPlansQuery) {
        return apiFetch<ApiResponse<UrbanPlan[]>>('/urban-plans', {
            method: 'GET',
            query: params,
        });
    },

    getById(id: string) {
        return apiFetch<ApiResponse<UrbanPlan>>(`/urban-plans/${id}`, {
            method: 'GET',
        });
    },

    create(body: CreateUrbanPlanDTO) {
        return apiFetch<ApiResponse<UrbanPlan>>('/urban-plans', {
            method: 'POST',
            body,
        });
    },

    update(id: string, body: UpdateUrbanPlanDTO) {
        return apiFetch<ApiResponse<UrbanPlan>>(`/urban-plans/${id}`, {
            method: 'PATCH',
            body,
        });
    },

    remove(id: string) {
        return apiFetch(`/urban-plans/${id}`, {
            method: 'DELETE',
        });
    },

    findAtPoint(lng: number, lat: number) {
        return apiFetch<ApiResponse<UrbanPlan | null>>('/urban-plans/at-point', {
            method: 'GET',
            query: { lng, lat },
        });
    },

    findIntersecting(wkt: string) {
        return apiFetch<ApiResponse<UrbanPlan[]>>('/urban-plans/intersects-with', {
            method: 'POST',
            body: { wkt },
        });
    },
});

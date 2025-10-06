import { ofetch } from 'ofetch';
import type { WaterQuality, CreateWaterQualityDTO, UpdateWaterQualityDTO, FindWaterQualitiesQuery, FindWithinRadiusQuery } from '../types/api/water-quality';

type OFetch = typeof ofetch;
type ApiResponse<T> = { data: T };

export default (apiFetch: OFetch) => ({
    getAll(params?: FindWaterQualitiesQuery) {
        return apiFetch<ApiResponse<WaterQuality[]>>('/water-qualities', {
            method: 'GET',
            query: params,
        });
    },

    getById(id: string) {
        return apiFetch<ApiResponse<WaterQuality>>(`/water-qualities/${id}`, {
            method: 'GET',
        });
    },

    create(body: CreateWaterQualityDTO) {
        return apiFetch<ApiResponse<WaterQuality>>('/water-qualities', {
            method: 'POST',
            body,
        });
    },

    update(id: string, body: UpdateWaterQualityDTO) {
        return apiFetch<ApiResponse<WaterQuality>>(`/water-qualities/${id}`, {
            method: 'PATCH',
            body,
        });
    },

    remove(id: string) {
        return apiFetch(`/water-qualities/${id}`, {
            method: 'DELETE',
        });
    },

    findWithinRadius(params: FindWithinRadiusQuery) {
        return apiFetch<ApiResponse<WaterQuality[]>>('/water-qualities/within-radius', {
            method: 'GET',
            query: params,
        });
    },
});

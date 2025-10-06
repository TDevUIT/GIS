import { ofetch } from 'ofetch';
import type { AirQuality, CreateAirQualityDTO, UpdateAirQualityDTO, FindAirQualitiesQuery, FindWithinRadiusQuery } from '../types/api/air-quality';

type OFetch = typeof ofetch;
type ApiResponse<T> = { data: T };

export default (apiFetch: OFetch) => ({
    getAll(params?: FindAirQualitiesQuery) {
        return apiFetch<ApiResponse<AirQuality[]>>('/air-qualities', {
            method: 'GET',
            query: params,
        });
    },

    getById(id: string) {
        return apiFetch<ApiResponse<AirQuality>>(`/air-qualities/${id}`, {
            method: 'GET',
        });
    },

    create(body: CreateAirQualityDTO) {
        return apiFetch<ApiResponse<AirQuality>>('/air-qualities', {
            method: 'POST',
            body,
        });
    },

    update(id: string, body: UpdateAirQualityDTO) {
        return apiFetch<ApiResponse<AirQuality>>(`/air-qualities/${id}`, {
            method: 'PATCH',
            body,
        });
    },

    remove(id: string) {
        return apiFetch(`/air-qualities/${id}`, {
            method: 'DELETE',
        });
    },

    findWithinRadius(params: FindWithinRadiusQuery) {
        return apiFetch<ApiResponse<AirQuality[]>>('/air-qualities/within-radius', {
            method: 'GET',
            query: params,
        });
    },
});

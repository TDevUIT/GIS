import { ofetch } from 'ofetch';
import type { Infrastructure, CreateInfrastructureDTO, UpdateInfrastructureDTO, FindInfrastructuresQuery, FindWithinRadiusQuery } from '../types/api/infrastructure';
import type { Image } from '../types/api/accident';
import type { SetImagesDTO } from '../types/api/accident';

type OFetch = typeof ofetch;
type ApiResponse<T> = { data: T };

export default (apiFetch: OFetch) => ({
    getAll(params?: FindInfrastructuresQuery) {
        return apiFetch<ApiResponse<Infrastructure[]>>('/infrastructures', {
            method: 'GET',
            query: params,
        });
    },

    getById(id: string) {
        return apiFetch<ApiResponse<Infrastructure>>(`/infrastructures/${id}`, {
            method: 'GET',
        });
    },

    create(body: CreateInfrastructureDTO) {
        return apiFetch<ApiResponse<Infrastructure>>('/infrastructures', {
            method: 'POST',
            body,
        });
    },

    update(id: string, body: UpdateInfrastructureDTO) {
        return apiFetch<ApiResponse<Infrastructure>>(`/infrastructures/${id}`, {
            method: 'PATCH',
            body,
        });
    },

    remove(id: string) {
        return apiFetch(`/infrastructures/${id}`, {
            method: 'DELETE',
        });
    },

    findWithinRadius(params: FindWithinRadiusQuery) {
        return apiFetch<ApiResponse<Infrastructure[]>>('/infrastructures/within-radius', {
            method: 'GET',
            query: params,
        });
    },

    uploadImages(files: File[]) {
        const formData = new FormData();
        files.forEach(file => formData.append('images', file));
        return apiFetch<ApiResponse<Omit<Image, 'id' | 'createdAt'>[]>>('/infrastructures/upload', {
            method: 'POST',
            body: formData,
        });
    },

    setImages(infraId: string, body: SetImagesDTO) {
        return apiFetch<ApiResponse<Image[]>>(`/infrastructures/${infraId}/images`, {
            method: 'POST',
            body,
        });
    },

    deleteImage(infraId: string, imageId: string) {
        return apiFetch(`/infrastructures/${infraId}/images/${imageId}`, {
            method: 'DELETE',
        });
    }
});

import { ofetch } from 'ofetch';
import type { Accident, CreateAccidentDTO, UpdateAccidentDTO, Image, SetImagesDTO } from '../types/api/accident';

type OFetch = typeof ofetch;
type ApiResponse<T> = { data: T };

export default (apiFetch: OFetch) => ({
    getAll() {
        return apiFetch<ApiResponse<Accident[]>>('/accidents', {
            method: 'GET',
        });
    },

    getById(id: string) {
        return apiFetch<ApiResponse<Accident>>(`/accidents/${id}`, {
            method: 'GET',
        });
    },

    create(body: CreateAccidentDTO) {
        return apiFetch<ApiResponse<Accident>>('/accidents', {
            method: 'POST',
            body,
        });
    },

    update(id: string, body: UpdateAccidentDTO) {
        return apiFetch<ApiResponse<Accident>>(`/accidents/${id}`, {
            method: 'PATCH',
            body,
        });
    },

    remove(id: string) {
        return apiFetch(`/accidents/${id}`, {
            method: 'DELETE',
        });
    },

    uploadImages(files: File[]) {
        const formData = new FormData();
        files.forEach(file => {
            formData.append('images', file);
        });
        return apiFetch<ApiResponse<Omit<Image, 'id' | 'createdAt'>[]>>('/accidents/upload', {
            method: 'POST',
            body: formData,
        });
    },

    setImages(accidentId: string, body: SetImagesDTO) {
        return apiFetch<ApiResponse<Image[]>>(`/accidents/${accidentId}/images`, {
            method: 'POST',
            body,
        });
    },

    deleteImage(accidentId: string, imageId: string) {
        return apiFetch(`/accidents/${accidentId}/images/${imageId}`, {
            method: 'DELETE',
        });
    }
});

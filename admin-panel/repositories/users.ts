import { ofetch } from 'ofetch';
import type { User, CreateSupervisorDTO, ChangeRoleDTO } from '../types/api/auth';

type OFetch = typeof ofetch;
type ApiResponse<T> = { data: T };

export default (apiFetch: OFetch) => ({
    createSupervisor(body: CreateSupervisorDTO) {
        return apiFetch<{ message: string; userId: string }>('/auth/supervisor', {
            method: 'POST',
            body,
        });
    },

    async getAll(): Promise<User[]> {
        const response = await apiFetch<ApiResponse<User[]>>('/users', {
            method: 'GET',
        });
        return response.data;
    },

    async getById(id: string): Promise<User> {
        const response = await apiFetch<ApiResponse<User>>(`/users/${id}`, {
            method: 'GET',
        });
        return response.data;
    },

    activate(id: string) {
        return apiFetch<{ message: string }>(`/users/${id}/activate`, {
            method: 'PATCH',
        });
    },

    deactivate(id: string) {
        return apiFetch<{ message: string }>(`/users/${id}/deactivate`, {
            method: 'PATCH',
        });
    },

    changeRole(body: ChangeRoleDTO) {
        return apiFetch<{ message: string }>('/auth/role', {
            method: 'PATCH',
            body,
        });
    },
});

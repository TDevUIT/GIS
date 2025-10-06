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

    getAll() {
        return apiFetch<ApiResponse<User[]>>('/users', {
            method: 'GET',
        });
    },

    getById(id: string) {
        return apiFetch<ApiResponse<User>>(`/users/${id}`, {
            method: 'GET',
        });
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

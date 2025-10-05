import { ofetch } from 'ofetch';
import type { LoginResponse, User, SetPasswordDTO } from '../types/api/auth';

type OFetch = typeof ofetch;
type ApiResponse<T> = { data: T };

export default (apiFetch: OFetch) => ({
    login(credentials: { email: string; password: string }) {
        return apiFetch<LoginResponse>('/auth/login', {
            method: 'POST',
            body: credentials,
        });
    },

    setPassword(body: SetPasswordDTO) {
        return apiFetch<{ message: string }>('/auth/set-password', {
            method: 'POST',
            body,
        });
    },

    getProfile() {
        return apiFetch<User>('/auth/profile', {
            method: 'GET',
        });
    },

    logout() {
        return apiFetch<{ message: string }>('/auth/logout', {
            method: 'POST',
        });
    },

    refreshToken() {
        return apiFetch<{ message: string }>('/auth/refresh', {
            method: 'POST',
        });
    },
});

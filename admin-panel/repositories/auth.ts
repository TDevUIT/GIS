import { ofetch } from 'ofetch';
import type { LoginResponse, User, SetPasswordDTO } from '../types/api/auth';

type OFetch = typeof ofetch;

export default (apiFetch: OFetch) => ({
    login(credentials: { email: string; password: string }) {
        return apiFetch<LoginResponse>('/auth/login', {
            method: 'POST',
            body: credentials,
        });
    },

    setPassword(body: SetPasswordDTO, token: string) {
        return apiFetch<{ message: string }>('/auth/set-password', {
            method: 'POST',
            body,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    },

    async getProfile(): Promise<User> {
        const response = await apiFetch<{ data: User }>('/auth/profile', {
            method: 'GET',
        });
        return response.data;
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

    requestPasswordReset(email: string) {
        return apiFetch<{ message: string }>('/auth/forgot-password', {
            method: 'POST',
            body: { email },
        });
    },

    resetPassword(token: string, body: SetPasswordDTO) {
        return apiFetch<{ message: string }>(`/auth/reset-password/${token}`, {
            method: 'POST',
            body,
        });
    },
});

import { defineNuxtPlugin, useRuntimeConfig, navigateTo } from 'nuxt/app';
import { ofetch } from 'ofetch';
import { apiFactory } from '../repositories/factory';
import { useAuthStore } from '../store/auth';

let isRefreshing = false;
let failedQueue: Array<{ resolve: (value: unknown) => void; reject: (reason?: any) => void }> = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

export default defineNuxtPlugin((nuxtApp) => {
    const config = useRuntimeConfig();

    const apiFetch = ofetch.create({
        baseURL: config.public.apiBaseUrl as string,
        credentials: 'include',

        onRequest({ options }) {},

        async onResponseError({ request, response, options }) {
            console.error(`[API Error] ${response.status} ${response.statusText} on ${request}`);
            if (response._data) {
                console.error('Error details:', response._data);
            }

            const originalRequest = options;
            const authStore = useAuthStore();

            if (response.status === 401) {
                if (request.toString().includes('/auth/refresh')) {
                    console.error('Refresh token failed. Logging out.');
                    authStore.clear();
                    await navigateTo('/login');
                    return;
                }

                if (isRefreshing) {
                    return new Promise((resolve, reject) => {
                        failedQueue.push({ resolve, reject });
                    })
                        .then(() => {
                            return apiFetch(request, originalRequest);
                        })
                        .catch(err => {
                            return Promise.reject(err);
                        });
                }

                isRefreshing = true;

                try {
                    await ofetch('/auth/refresh', {
                        baseURL: config.public.apiBaseUrl as string,
                        credentials: 'include',
                        method: 'POST'
                    });

                    processQueue(null, 'new_token');
                    return apiFetch(request, originalRequest);
                } catch (refreshError) {
                    processQueue(refreshError, null);
                    authStore.clear();
                    await navigateTo('/login');
                    return Promise.reject(refreshError);
                } finally {
                    isRefreshing = false;
                }
            }
        },
    });

    const repositories = apiFactory(apiFetch);

    return {
        provide: {
            api: repositories,
        },
    };
});

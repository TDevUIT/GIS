import { defineNuxtPlugin, useRuntimeConfig, navigateTo } from 'nuxt/app';
import { ofetch } from 'ofetch';
import { apiFactory } from '../repositories/factory';
import { useAuthStore } from '../store/auth';

export default defineNuxtPlugin((nuxtApp) => {
    const config = useRuntimeConfig();

    const apiFetch = ofetch.create({
        baseURL: config.public.apiBaseUrl as string,
        onRequest({ options }) {},
        onResponseError({ request, response, options }) {
            console.error(`[API Error] ${response.status} ${response.statusText} on ${request}`);
            if (response._data) {
                console.error('Error details:', response._data);
            }
            if (response.status === 401) {
                const authStore = useAuthStore();
                if (authStore.isAuthenticated) {
                    console.log('Token expired or invalid. Logging out and redirecting to login page...');
                    authStore.clear();
                    navigateTo('/login');
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

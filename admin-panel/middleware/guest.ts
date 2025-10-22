import { defineNuxtRouteMiddleware, navigateTo } from 'nuxt/app';
import { useAuthStore } from '../store/auth';

export default defineNuxtRouteMiddleware(() => {
    const authStore = useAuthStore();

    if (authStore.isAuthenticated) {
        return navigateTo('/', { replace: true });
    }
});

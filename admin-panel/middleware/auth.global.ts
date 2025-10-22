import { defineNuxtRouteMiddleware, navigateTo, abortNavigation } from 'nuxt/app';
import { useAuthStore } from '../store/auth';
import { useAuthInit } from '~/composables/useAuthInit';

const publicRoutes = [
    '/login',
    '/forgot-password',
    '/reset-password',
    '/set-password'
];
const adminOnlyRoutes = ['/users'];

export default defineNuxtRouteMiddleware(async (to) => {
    if (publicRoutes.includes(to.path)) {
        return;
    }

    const authStore = useAuthStore();
    const { authInitPromise } = useAuthInit();

    if (authInitPromise.value) {
        await authInitPromise.value;
    }

    if (!authStore.isAuthenticated) {
        return navigateTo(`/login?redirect=${to.fullPath}`, { replace: true });
    }

    const requiresAdmin = adminOnlyRoutes.some(route => to.path.startsWith(route));
    if (requiresAdmin && !authStore.isAdmin) {
        return abortNavigation({
            statusCode: 403,
            message: 'You do not have permission to access this page.',
        });
    }
});

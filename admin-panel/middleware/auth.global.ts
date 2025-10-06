import { defineNuxtRouteMiddleware, navigateTo, abortNavigation } from 'nuxt/app';
import { useAuth } from '../composables/useAuth';
import { useAuthStore } from '../store/auth';

const publicRoutes = ['/login'];
const adminOnlyRoutes = ['/users'];

export default defineNuxtRouteMiddleware(async (to, from) => {
    if (publicRoutes.includes(to.path)) {
        return;
    }

    const authStore = useAuthStore();
    const { fetchUser } = useAuth();

    if (!authStore.isAuthenticated) {
        await fetchUser();
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

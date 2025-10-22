import { navigateTo, useNuxtApp } from 'nuxt/app';
import { useAuthStore } from '../store/auth';
import type { User } from '../types/api/auth';
import { computed } from 'vue';

export const useAuth = () => {
    const { $api } = useNuxtApp() as unknown as { $api: any };
    const authStore = useAuthStore();

    const fetchUser = async (): Promise<User | null> => {
        try {
            const user = await $api.auth.getProfile();
            if (user) {
                authStore.setUser(user);
                return user;
            }
            return null;
        } catch (error) {
            if ((error as any).response?.status !== 401) {
                console.error('Failed to fetch user profile:', error);
            }
            authStore.clear();
            return null;
        }
    };

    const logout = async () => {
        try {
            await $api.auth.logout();
        } catch (error) {
            console.error('Logout failed:', error);
        } finally {
            authStore.clear();
            await navigateTo('/login');
        }
    };

    return {
        user: computed(() => authStore.user),
        isAuthenticated: computed(() => authStore.isAuthenticated),
        isAdmin: computed(() => authStore.isAdmin),
        isSupervisor: computed(() => authStore.isSupervisor),
        fetchUser,
        logout,
    };
};

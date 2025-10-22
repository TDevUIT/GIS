import { defineStore } from 'pinia';
// <<< SỬA LỖI: Thêm đuôi file `.ts` vào cuối đường dẫn import
import { type User, Role } from '../types/api/auth';

interface AuthState {
    user: User | null;
}

export const useAuthStore = defineStore('auth', {
    state: (): AuthState => ({
        user: null,
    }),

    getters: {
        isAuthenticated: (state): boolean => !!state.user,
        isAdmin: (state): boolean => !!state.user && state.user.role === Role.ADMIN,
        isSupervisor: (state): boolean => !!state.user && state.user.role === Role.SUPERVISOR,
    },

    actions: {
        setUser(userData: User | null) {
            this.user = userData;
        },
        clear() {
            this.user = null;
        },
    },

    persist: true,
});

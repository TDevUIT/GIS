import { defineStore } from 'pinia';
import type { User } from '../types/api/auth';

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
}

export const useAuthStore = defineStore('auth', {
    state: (): AuthState => ({
        user: null,
        isAuthenticated: false,
    }),

    getters: {
        isAdmin: (state): boolean => state.user?.role === 'ADMIN',
        isSupervisor: (state): boolean => state.user?.role === 'SUPERVISOR',
    },

    actions: {
        setUser(userData: User | null) {
            if (userData) {
                this.user = userData;
                this.isAuthenticated = true;
            } else {
                this.user = null;
                this.isAuthenticated = false;
            }
        },
        clear() {
            this.user = null;
            this.isAuthenticated = false;
        },
    },
});

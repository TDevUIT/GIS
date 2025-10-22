import { defineStore } from 'pinia';
import { type User, Role } from '../types/api/auth';

interface AuthState {
    user: User | null;
}

export const useAuthStore = defineStore('auth', {
    state: (): AuthState => ({
        user: null
    }),

    getters: {
        isAuthenticated: (state): boolean => !!state.user,
        isAdmin: (state): boolean => !!state.user && state.user.role === Role.ADMIN,
        isSupervisor: (state): boolean => !!state.user && state.user.role === Role.SUPERVISOR
    },

    actions: {
        setUser(userData: User | null) {
            this.user = userData;
        },
        clear() {
            this.user = null;
        }
    },

    persist: {
        storage: {
            getItem: (key: string) => {
                if (process.client) return localStorage.getItem(key);
                return null;
            },
            setItem: (key: string, value: string) => {
                if (process.client) localStorage.setItem(key, value);
            }
        }
    }
});

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  login: (user: User, token: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,

      login: (user: User, token: string) => {
        console.log('🔐 Auth Store: User logged in', user.email);
        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        });
        
        if (typeof window !== 'undefined') {
          localStorage.setItem('access_token', token);
        }
      },

      logout: () => {
        console.log('🚪 Auth Store: User logged out');
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
        
        if (typeof window !== 'undefined') {
          localStorage.removeItem('access_token');
        }
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      updateUser: (userData: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          console.log('👤 Auth Store: User updated', userData);
          set({
            user: { ...currentUser, ...userData }
          });
        }
      },
    }),
    {
      name: 'ie402-auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

import { create } from 'zustand';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}

interface UIState {

  notifications: Notification[];

  globalLoading: boolean;
  loadingStates: Record<string, boolean>;

  modals: Record<string, boolean>;

  theme: 'light' | 'dark';

  sidebarCollapsed: boolean;

  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  setGlobalLoading: (loading: boolean) => void;
  setLoading: (key: string, loading: boolean) => void;
  openModal: (modalId: string) => void;
  closeModal: (modalId: string) => void;
  toggleModal: (modalId: string) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  toggleSidebar: () => void;
}

export const useUIStore = create<UIState>((set, get) => ({

  notifications: [],
  globalLoading: false,
  loadingStates: {},
  modals: {},
  theme: 'light',
  sidebarCollapsed: false,

  addNotification: (notification) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newNotification = { ...notification, id };

    set((state) => ({
      notifications: [...state.notifications, newNotification]
    }));

    const duration = notification.duration || 5000;
    setTimeout(() => {
      get().removeNotification(id);
    }, duration);
  },

  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter(n => n.id !== id)
    }));
  },

  clearNotifications: () => {
    set({ notifications: [] });
  },

  setGlobalLoading: (loading) => {
    set({ globalLoading: loading });
  },

  setLoading: (key, loading) => {
    set((state) => ({
      loadingStates: {
        ...state.loadingStates,
        [key]: loading
      }
    }));
  },

  openModal: (modalId) => {
    set((state) => ({
      modals: {
        ...state.modals,
        [modalId]: true
      }
    }));
  },

  closeModal: (modalId) => {
    set((state) => ({
      modals: {
        ...state.modals,
        [modalId]: false
      }
    }));
  },

  toggleModal: (modalId) => {
    const isOpen = get().modals[modalId];
    set((state) => ({
      modals: {
        ...state.modals,
        [modalId]: !isOpen
      }
    }));
  },

  setTheme: (theme) => {
    set({ theme });
  },

  toggleSidebar: () => {
    const collapsed = get().sidebarCollapsed;
    set({ sidebarCollapsed: !collapsed });
  },
}));

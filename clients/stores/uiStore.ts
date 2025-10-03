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
    
    console.log('🔔 UI Store: Notification added', newNotification.type, newNotification.title);
    
    set((state) => ({
      notifications: [...state.notifications, newNotification]
    }));

    const duration = notification.duration || 5000;
    setTimeout(() => {
      get().removeNotification(id);
    }, duration);
  },

  removeNotification: (id) => {
    console.log('🗑️ UI Store: Notification removed', id);
    set((state) => ({
      notifications: state.notifications.filter(n => n.id !== id)
    }));
  },

  clearNotifications: () => {
    console.log('🧹 UI Store: All notifications cleared');
    set({ notifications: [] });
  },

  setGlobalLoading: (loading) => {
    console.log('⏳ UI Store: Global loading set to', loading);
    set({ globalLoading: loading });
  },

  setLoading: (key, loading) => {
    console.log(`⏳ UI Store: Loading state for ${key} set to`, loading);
    set((state) => ({
      loadingStates: {
        ...state.loadingStates,
        [key]: loading
      }
    }));
  },

  openModal: (modalId) => {
    console.log('🪟 UI Store: Modal opened', modalId);
    set((state) => ({
      modals: {
        ...state.modals,
        [modalId]: true
      }
    }));
  },

  closeModal: (modalId) => {
    console.log('❌ UI Store: Modal closed', modalId);
    set((state) => ({
      modals: {
        ...state.modals,
        [modalId]: false
      }
    }));
  },

  toggleModal: (modalId) => {
    const isOpen = get().modals[modalId];
    console.log('🔄 UI Store: Modal toggled', modalId, !isOpen);
    set((state) => ({
      modals: {
        ...state.modals,
        [modalId]: !isOpen
      }
    }));
  },

  setTheme: (theme) => {
    console.log('🎨 UI Store: Theme changed to', theme);
    set({ theme });
  },

  toggleSidebar: () => {
    const collapsed = get().sidebarCollapsed;
    console.log('📋 UI Store: Sidebar toggled to', !collapsed ? 'collapsed' : 'expanded');
    set({ sidebarCollapsed: !collapsed });
  },
}));

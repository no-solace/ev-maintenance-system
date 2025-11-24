import { create } from 'zustand';

const useAppStore = create((set) => ({
//sanh cho
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  // giao dien
  theme: 'light',
  setTheme: (theme) => set({ theme }),
//tai du lieu
  isPageLoading: false,
  setPageLoading: (loading) => set({ isPageLoading: loading }),
// thong bao
  notifications: [],
  addNotification: (notification) =>
    set((state) => ({
      notifications: [...state.notifications, { ...notification, id: Date.now() }],
    })),
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
  clearNotifications: () => set({ notifications: [] }),
//tim kiem
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
//tim kiem theo item
  selectedItems: [],
  setSelectedItems: (items) => set({ selectedItems: items }),
  clearSelectedItems: () => set({ selectedItems: [] }),
}));

export default useAppStore;
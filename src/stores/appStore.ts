
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AppState {
  // UI State
  sidebarCollapsed: boolean
  currentFilter: string
  searchTerm: string
  
  // User Preferences  
  theme: 'light' | 'dark' | 'system'
  language: string
  itemsPerPage: number
  
  // Notifications
  notifications: Array<{
    id: string
    type: 'info' | 'success' | 'warning' | 'error'
    title: string
    message: string
    timestamp: Date
    read: boolean
  }>
  
  // Actions
  setSidebarCollapsed: (collapsed: boolean) => void
  setCurrentFilter: (filter: string) => void
  setSearchTerm: (term: string) => void
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  setLanguage: (language: string) => void
  setItemsPerPage: (count: number) => void
  addNotification: (notification: Omit<AppState['notifications'][0], 'id' | 'timestamp' | 'read'>) => void
  markNotificationRead: (id: string) => void
  clearNotifications: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      sidebarCollapsed: false,
      currentFilter: 'all',
      searchTerm: '',
      theme: 'system',
      language: 'en',
      itemsPerPage: 10,
      notifications: [],
      
      // Actions
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      setCurrentFilter: (filter) => set({ currentFilter: filter }),
      setSearchTerm: (term) => set({ searchTerm: term }),
      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
      setItemsPerPage: (count) => set({ itemsPerPage: count }),
      
      addNotification: (notification) => set((state) => ({
        notifications: [
          {
            ...notification,
            id: Date.now().toString(),
            timestamp: new Date(),
            read: false
          },
          ...state.notifications
        ].slice(0, 50) // Keep only last 50 notifications
      })),
      
      markNotificationRead: (id) => set((state) => ({
        notifications: state.notifications.map(n => 
          n.id === id ? { ...n, read: true } : n
        )
      })),
      
      clearNotifications: () => set({ notifications: [] })
    }),
    {
      name: 'app-store',
      partialize: (state) => ({
        theme: state.theme,
        language: state.language,
        itemsPerPage: state.itemsPerPage,
        sidebarCollapsed: state.sidebarCollapsed
      })
    }
  )
)

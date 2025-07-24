// lib/stores/persistenceStore.ts - Comprehensive Persistence Store
import { create } from 'zustand'
import { useLayoutStore } from './layoutStore'
import { useUserStore } from './userStore'

interface PersistenceState {
    // State
    isLoading: boolean
    lastSyncTime: Date | null
    hasUnsavedChanges: boolean

    // Actions
    setLoading: (loading: boolean) => void
    setLastSync: (time: Date) => void
    setUnsavedChanges: (hasChanges: boolean) => void

    // Persistence operations
    saveToStorage: () => Promise<void>
    loadFromStorage: (username: string) => Promise<void>
    exportData: () => string
    importData: (data: string) => Promise<void>
    clearAllData: () => void

    // Auto-save
    enableAutoSave: (interval?: number) => void
    disableAutoSave: () => void
}

let autoSaveInterval: NodeJS.Timeout | null = null

export const usePersistenceStore = create<PersistenceState>((set, get) => ({
    isLoading: false,
    lastSyncTime: null,
    hasUnsavedChanges: false,

    setLoading: (loading) => set({ isLoading: loading }),
    setLastSync: (time) => set({ lastSyncTime: time }),
    setUnsavedChanges: (hasChanges) => set({ hasUnsavedChanges: hasChanges }),

    saveToStorage: async () => {
        set({ isLoading: true })
        try {
            const username = useUserStore.getState().username
            if (!username) {
                throw new Error('No username provided')
            }

            // Save layout
            useLayoutStore.getState().saveLayout(username)

            // Save user data (already persisted by zustand-persist)
            // Additional custom saving logic can go here

            set({
                lastSyncTime: new Date(),
                hasUnsavedChanges: false
            })

            console.log('Data saved successfully')
        } catch (error) {
            console.error('Failed to save data:', error)
            throw error
        } finally {
            set({ isLoading: false })
        }
    },

    loadFromStorage: async (username) => {
        set({ isLoading: true })
        try {
            if (!username) {
                throw new Error('No username provided')
            }

            // Load layout
            useLayoutStore.getState().loadLayout(username)

            // Set username
            useUserStore.getState().setUsername(username)

            set({
                lastSyncTime: new Date(),
                hasUnsavedChanges: false
            })

            console.log('Data loaded successfully')
        } catch (error) {
            console.error('Failed to load data:', error)
            throw error
        } finally {
            set({ isLoading: false })
        }
    },

    exportData: () => {
        const username = useUserStore.getState().username
        const profile = useUserStore.getState().profile
        const layout = useLayoutStore.getState().layout

        const exportData = {
            version: '1.0',
            exportDate: new Date().toISOString(),
            username,
            profile,
            layout
        }

        return JSON.stringify(exportData, null, 2)
    },

    importData: async (data: string) => {
        set({ isLoading: true })
        try {
            const parsedData = JSON.parse(data)

            if (!parsedData.version || !parsedData.username) {
                throw new Error('Invalid data format')
            }

            // Import user data
            useUserStore.getState().setUsername(parsedData.username)
            useUserStore.getState().setProfile(parsedData.profile || {})

            // Import layout
            useLayoutStore.getState().setLayout(parsedData.layout || [])

            set({
                lastSyncTime: new Date(),
                hasUnsavedChanges: false
            })

            console.log('Data imported successfully')
        } catch (error) {
            console.error('Failed to import data:', error)
            throw error
        } finally {
            set({ isLoading: false })
        }
    },

    clearAllData: () => {
        useLayoutStore.getState().clearLayout()
        useUserStore.getState().clearUser()

        // Clear localStorage
        if (typeof window !== 'undefined') {
            Object.keys(localStorage).forEach(key => {
                if (key.startsWith('user:') || key.includes('builder') || key.includes('layout')) {
                    localStorage.removeItem(key)
                }
            })
        }

        set({
            lastSyncTime: null,
            hasUnsavedChanges: false
        })
    },

    enableAutoSave: (interval = 30000) => { // 30 seconds default
        if (autoSaveInterval) {
            clearInterval(autoSaveInterval)
        }

        autoSaveInterval = setInterval(async () => {
            const hasChanges = get().hasUnsavedChanges
            if (hasChanges) {
                try {
                    await get().saveToStorage()
                } catch (error) {
                    console.error('Auto-save failed:', error)
                }
            }
        }, interval)
    },

    disableAutoSave: () => {
        if (autoSaveInterval) {
            clearInterval(autoSaveInterval)
            autoSaveInterval = null
        }
    }
}))

// Hook to track changes and mark as unsaved
export const useTrackChanges = () => {
    const setUnsavedChanges = usePersistenceStore(state => state.setUnsavedChanges)

    return () => {
        setUnsavedChanges(true)
    }
}
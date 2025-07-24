import { create } from 'zustand'
import { useLayoutStore } from './layoutStore'
import { useUserStore } from './userStore'

interface PersistenceState {
    // State
    isLoading: boolean
    lastSyncTime: Date | null
    hasUnsavedChanges: boolean
    previousUsername: string | null // Track previous username

    // Actions
    setLoading: (loading: boolean) => void
    setLastSync: (time: Date) => void
    setUnsavedChanges: (hasChanges: boolean) => void
    setPreviousUsername: (username: string | null) => void

    // Persistence operations
    saveToStorage: () => Promise<void>
    loadFromStorage: (username: string) => Promise<void>
    migrateUsername: (oldUsername: string, newUsername: string) => Promise<void>
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
    previousUsername: null,

    setLoading: (loading) => set({ isLoading: loading }),
    setLastSync: (time) => set({ lastSyncTime: time }),
    setUnsavedChanges: (hasChanges) => set({ hasUnsavedChanges: hasChanges }),
    setPreviousUsername: (username) => set({ previousUsername: username }),

    saveToStorage: async () => {
        set({ isLoading: true })
        try {
            const username = useUserStore.getState().username
            if (!username) {
                throw new Error('No username provided')
            }

            // Save layout directly - no automatic migration
            useLayoutStore.getState().saveLayout(username)

            set({
                lastSyncTime: new Date(),
                hasUnsavedChanges: false,
                previousUsername: username
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

            // Set username in user store
            useUserStore.getState().setUsername(username)

            // Track this as the previous username
            set({ previousUsername: username })

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

    migrateUsername: async (oldUsername, newUsername) => {
        if (typeof window === 'undefined') return

        try {
            console.log(`Starting migration from ${oldUsername} to ${newUsername}`)

            // Get the old data
            const oldLayoutKey = `user:${oldUsername}:layout`
            const oldLayoutData = localStorage.getItem(oldLayoutKey)

            if (oldLayoutData) {
                // Save to new key
                const newLayoutKey = `user:${newUsername}:layout`
                localStorage.setItem(newLayoutKey, oldLayoutData)

                console.log(`Copied data to ${newLayoutKey}`)

                // Remove old key
                localStorage.removeItem(oldLayoutKey)

                console.log(`Removed old data from ${oldLayoutKey}`)

                // Also update the layout store to use the new username
                useLayoutStore.getState().loadLayout(newUsername)

                console.log(`Successfully migrated data from ${oldUsername} to ${newUsername}`)
            } else {
                console.log(`No data found for ${oldUsername}, skipping migration`)
            }

        } catch (error) {
            console.error('Failed to migrate username data:', error)
            throw error
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
                hasUnsavedChanges: false,
                previousUsername: parsedData.username
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
            hasUnsavedChanges: false,
            previousUsername: null
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
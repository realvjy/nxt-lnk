import { create } from 'zustand'
import { useLayoutStore } from './layoutStore'
import { useUserStore } from './userStore'
import { useLinksStore } from './linksStore'
import { useBlocksStore } from './blocksStore'

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

            // Save layout (existing blocks/layout system)
            useLayoutStore.getState().saveLayout(username)

            // Save new separated data
            const links = useLinksStore.getState().links
            const blocks = useBlocksStore.getState().blocks

            // Save links to localStorage
            if (typeof window !== 'undefined') {
                localStorage.setItem(`user:${username}:links`, JSON.stringify(links))
                localStorage.setItem(`user:${username}:blocks`, JSON.stringify(blocks))
            }

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

            // Load layout (existing blocks/layout system)
            useLayoutStore.getState().loadLayout(username)

            // Load new separated data
            if (typeof window !== 'undefined') {
                const linksData = localStorage.getItem(`user:${username}:links`)
                const blocksData = localStorage.getItem(`user:${username}:blocks`)

                if (linksData) {
                    const links = JSON.parse(linksData)
                    useLinksStore.getState().setLinks(links)
                } else {
                    useLinksStore.getState().clearLinks()
                }

                if (blocksData) {
                    const blocks = JSON.parse(blocksData)
                    useBlocksStore.getState().setBlocks(blocks)
                } else {
                    useBlocksStore.getState().clearBlocks()
                }
            }

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
            const oldLinksKey = `user:${oldUsername}:links`
            const oldBlocksKey = `user:${oldUsername}:blocks`

            const oldLayoutData = localStorage.getItem(oldLayoutKey)
            const oldLinksData = localStorage.getItem(oldLinksKey)
            const oldBlocksData = localStorage.getItem(oldBlocksKey)

            // Migrate layout data
            if (oldLayoutData) {
                const newLayoutKey = `user:${newUsername}:layout`
                localStorage.setItem(newLayoutKey, oldLayoutData)
                localStorage.removeItem(oldLayoutKey)
                console.log(`Migrated layout data`)
            }

            // Migrate links data
            if (oldLinksData) {
                const newLinksKey = `user:${newUsername}:links`
                localStorage.setItem(newLinksKey, oldLinksData)
                localStorage.removeItem(oldLinksKey)
                console.log(`Migrated links data`)
            }

            // Migrate blocks data
            if (oldBlocksData) {
                const newBlocksKey = `user:${newUsername}:blocks`
                localStorage.setItem(newBlocksKey, oldBlocksData)
                localStorage.removeItem(oldBlocksKey)
                console.log(`Migrated blocks data`)
            }

            // Reload data with new username
            useLayoutStore.getState().loadLayout(newUsername)

            if (oldLinksData) {
                const links = JSON.parse(oldLinksData)
                useLinksStore.getState().setLinks(links)
            }

            if (oldBlocksData) {
                const blocks = JSON.parse(oldBlocksData)
                useBlocksStore.getState().setBlocks(blocks)
            }

            console.log(`Successfully migrated data from ${oldUsername} to ${newUsername}`)

        } catch (error) {
            console.error('Failed to migrate username data:', error)
            throw error
        }
    },

    exportData: () => {
        const username = useUserStore.getState().username
        const profile = useUserStore.getState().profile
        const layout = useLayoutStore.getState().layout
        const links = useLinksStore.getState().links
        const blocks = useBlocksStore.getState().blocks

        const exportData = {
            version: '2.0', // Updated version for new format
            exportDate: new Date().toISOString(),
            username,
            profile,
            layout,
            links,
            blocks
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

            // Import new separated data (if available)
            if (parsedData.links) {
                useLinksStore.getState().setLinks(parsedData.links)
            } else {
                useLinksStore.getState().clearLinks()
            }

            if (parsedData.blocks) {
                useBlocksStore.getState().setBlocks(parsedData.blocks)
            } else {
                useBlocksStore.getState().clearBlocks()
            }

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
        useLinksStore.getState().clearLinks()
        useBlocksStore.getState().clearBlocks()

        // Clear localStorage
        if (typeof window !== 'undefined') {
            Object.keys(localStorage).forEach(key => {
                if (key.startsWith('user:') || key.includes('builder') || key.includes('layout') || key.includes('links') || key.includes('blocks')) {
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
// persistenceStore.ts
import { create } from 'zustand'
import { Block } from '@/shared/blocks'
import { useUserStore } from './userStore'
import { useLayoutStore } from './layoutStore'

type PersistenceState = {
    loadFromStorage: () => void
    saveToStorage: () => void
    clearStorage: () => void
}

export const usePersistenceStore = create<PersistenceState>((set, get) => ({
    loadFromStorage: () => {
        // Get username from localStorage
        const username = useUserStore.getState().getStoredUsername()

        if (username) {
            // Load layout for this username
            useLayoutStore.getState().getStoredLayout(username)
        }
    },

    saveToStorage: () => {
        const username = useUserStore.getState().username
        const layout = useLayoutStore.getState().layout

        if (!username) return

        // Save layout to localStorage
        localStorage.setItem(`user:${username}`, JSON.stringify(layout))

        // Ensure username is saved
        localStorage.setItem('active:username', username)
    },

    clearStorage: () => {
        if (typeof window === 'undefined') return

        // Clear all localStorage
        localStorage.clear()

        // Reset state in other stores
        useUserStore.getState().setUsername('')
        useLayoutStore.getState().setLayout([])
    }
}))
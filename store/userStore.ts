// userStore.ts
import { create } from 'zustand'

type UserState = {
    username: string
    setUsername: (username: string) => void
    getStoredUsername: () => string
}

// Helper function for localStorage
const getStoredUsername = () => {
    if (typeof window === 'undefined') return ''
    return localStorage.getItem('active:username') || ''
}

export const useUserStore = create<UserState>((set, get) => ({
    username: '',

    setUsername: (username) => {
        set({ username })

        if (username) {
            // Save username to localStorage
            if (typeof window !== 'undefined') {
                localStorage.setItem('active:username', username)
            }
        }
    },

    getStoredUsername: () => {
        const storedUsername = getStoredUsername()
        if (storedUsername) {
            set({ username: storedUsername })
        }
        return storedUsername
    }
}))
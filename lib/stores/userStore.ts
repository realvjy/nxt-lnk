// lib/stores/userStore.ts - Enhanced User Store
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Profile {
    fullName: string
    tagline?: string
    bio?: string
    image?: {
        url: string
        alt?: string
    }
    badge?: string
}

interface UserState {
    // User data
    username: string
    profile: Profile

    // Actions
    setUsername: (username: string) => void
    setProfile: (profile: Partial<Profile>) => void
    updateProfile: (updates: Partial<Profile>) => void

    // Initialization
    initializeUser: () => void
    clearUser: () => void

    // Helpers
    isProfileComplete: () => boolean
    getDisplayName: () => string
}

export const useUserStore = create<UserState>()(
    persist(
        (set, get) => ({
            username: '',
            profile: {
                fullName: '',
                tagline: '',
                bio: '',
                image: undefined,
                badge: undefined
            },

            setUsername: (username) => {
                set({ username })
            },

            setProfile: (profile) => {
                set((state) => ({
                    profile: { ...state.profile, ...profile }
                }))
            },

            updateProfile: (updates) => {
                set((state) => ({
                    profile: { ...state.profile, ...updates }
                }))
            },

            initializeUser: () => {
                // This would typically load from your API
                // For now, we'll just ensure the user is initialized
                const state = get()
                if (!state.username) {
                    // Could redirect to onboarding or set default values
                    console.log('User not initialized')
                }
            },

            clearUser: () => {
                set({
                    username: '',
                    profile: {
                        fullName: '',
                        tagline: '',
                        bio: '',
                        image: undefined,
                        badge: undefined
                    }
                })
            },

            isProfileComplete: () => {
                const { username, profile } = get()
                return !!(username && profile.fullName)
            },

            getDisplayName: () => {
                const { profile, username } = get()
                return profile.fullName || username || 'User'
            }
        }),
        {
            name: 'user-data',
            version: 1
        }
    )
)
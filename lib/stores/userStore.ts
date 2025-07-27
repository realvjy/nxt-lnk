// /lib/stores/userStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { profileService } from 'supabase/services/profile'

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
    loading: boolean
    error: string | null

    // Actions
    setUsername: (username: string) => void
    setProfile: (profile: Partial<Profile>) => void
    updateProfile: (updates: Partial<Profile>) => Promise<void>
    fetchProfile: (username: string) => Promise<void>

    // Initialization
    initializeUser: () => void
    clearUser: () => void
    getStoredUsername: () => string

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
            loading: false,
            error: null,

            setUsername: (username) => {
                set({ username })
            },

            setProfile: (profile) => {
                set((state) => ({
                    profile: { ...state.profile, ...profile }
                }))
            },

            updateProfile: async (updates) => {
                const { username } = get()
                if (!username) return

                set({ loading: true })
                try {
                    await profileService.updateProfile(username, updates)
                    set((state) => ({
                        profile: { ...state.profile, ...updates },
                        loading: false,
                        error: null
                    }))
                } catch (error) {
                    set({
                        error: 'Failed to update profile',
                        loading: false
                    })
                }
            },

            fetchProfile: async (username) => {
                set({ loading: true })
                try {
                    const profile = await profileService.getProfile(username)
                    if (profile) {
                        set({
                            username,
                            profile: {
                                fullName: profile.fullName,
                                tagline: profile.tagline,
                                bio: profile.bio,
                                image: profile.image,
                                badge: profile.badge
                            },
                            loading: false,
                            error: null
                        })
                    }
                } catch (error) {
                    set({
                        error: 'Failed to fetch profile',
                        loading: false
                    })
                }
            },

            initializeUser: () => {
                // Keep existing initialization logic
                const username = get().getStoredUsername()
                if (username) {
                    set({ username })
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

            getStoredUsername: () => get().username,

            isProfileComplete: () => {
                const { profile } = get()
                return Boolean(profile.fullName)
            },

            getDisplayName: () => {
                const { profile } = get()
                return profile.fullName || 'Anonymous'
            }
        }),
        {
            name: 'user-storage'
        }
    )
)
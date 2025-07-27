// /lib/stores/userStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { profileService } from 'supabase/services/profile'

interface Profile {
    id: string; // <-- add this
    username: string; // <-- add this
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

    // State management
    setLoading: (loading: boolean) => void
    setError: (error: string | null) => void
}

export const useUserStore = create<UserState>()(
    persist(
        (set, get) => ({
            username: '',
            profile: {
                id: '',
                username: '',
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


            fetchProfile: async (identifier) => {
                set({ loading: true });
                try {
                    let profile;
                    // Simple check: if identifier looks like a UUID, use ID, else use username
                    if (identifier && /^[0-9a-fA-F-]{36}$/.test(identifier)) {
                        profile = await profileService.getProfileById(identifier);
                    } else {
                        profile = await profileService.getProfile(identifier);
                    }
                    if (profile) {
                        set({
                            username: profile.username,
                            profile: {
                                id: profile.id,
                                username: profile.username,
                                fullName: profile.fullName,
                                tagline: profile.tagline,
                                bio: profile.bio,
                                image: profile.image,
                                badge: profile.badge
                            },
                            loading: false,
                            error: null
                        });
                    }
                } catch (error) {
                    set({
                        error: 'Failed to fetch profile',
                        loading: false
                    });
                }
            },
            updateProfile: async (updates) => {
                const { profile } = get()
                if (!profile?.id) return
                set({ loading: true })
                try {
                    await profileService.updateProfileById(profile.id, updates)
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
                        id: '',
                        username: '',
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
            },

            // State management
            setLoading: (loading) => {
                set({ loading })
            },

            setError: (error) => {
                set({ error })
            },
        }),
        {
            name: 'user-storage'
        }
    )
)
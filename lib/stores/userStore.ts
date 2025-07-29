import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '@/supabase/client'
import { profileService } from '@/supabase/services/profile'

/** UI-facing profile shape (yours) */
interface Profile {
    id: string
    username: string
    fullName: string
    tagline?: string
    bio?: string
    image?: { url: string; alt?: string }
    badge?: string
}

type Status = 'idle' | 'loading' | 'ready' | 'error'

interface UserState {
    // Auth/session
    session: Session | null
    userId: string | null
    email: string | null

    // Profile & UI state
    username: string
    profile: Profile | null
    status: Status
    error: string | null

    // Actions
    setSession: (session: Session | null) => void
    setUsername: (username: string) => void
    setProfile: (profile: Partial<Profile> | null) => void

    refreshProfile: () => Promise<void>
    fetchProfile: (identifier: string) => Promise<void>  // (kept for backward-compat)
    updateProfile: (updates: Partial<Profile>) => Promise<void>

    // Init / teardown
    initializeUser: () => void
    clearUser: () => void
    getStoredUsername: () => string

    // Helpers
    isProfileComplete: () => boolean
    getDisplayName: () => string

    // State helpers
    setLoading: (loading: boolean) => void
    setError: (error: string | null) => void
}

/** Optional: normalize DB row (snake_case) to your UI (camelCase) in one place */
const dbToUiProfile = (row: any): Profile => ({
    id: row.id,
    username: row.username,
    fullName: row.full_name ?? '',
    tagline: row.tagline ?? '',
    bio: row.bio ?? '',
    image: row.image_url ? { url: row.image_url } : undefined,
    badge: row.badge ?? undefined,
})

export const useUserStore = create<UserState>()(
    persist(
        (set, get) => ({
            // Auth/session
            session: null,
            userId: null,
            email: null,

            // Profile & UI state
            username: '',
            profile: null,
            status: 'idle',
            error: null,

            setSession: (session) => {
                set({
                    session,
                    userId: session?.user?.id ?? null,
                    email: session?.user?.email ?? null,
                })
            },

            setUsername: (username) => set({ username }),

            setProfile: (profile) => {
                if (profile === null) {
                    set({ profile: null })
                    return
                }
                set((state) => ({
                    profile: { ...(state.profile ?? ({} as Profile)), ...profile },
                    username: profile.username ?? state.username,
                }))
            },

            /** Fetch the profile for the current session user */
            refreshProfile: async () => {
                const { userId } = get()
                if (!userId) {
                    set({ profile: null, status: 'ready' })
                    return
                }
                try {
                    set({ status: 'loading', error: null })
                    const row = await profileService.getProfileByUserId(userId)
                    const ui = row ? dbToUiProfile(row) : null
                    set({
                        profile: ui,
                        username: ui?.username ?? get().username,
                        status: 'ready',
                    })
                } catch (e: any) {
                    set({ error: e?.message ?? 'Failed to load profile', status: 'error' })
                }
            },

            /** Kept for your existing callers (by username or id) */
            fetchProfile: async (identifier) => {
                set({ status: 'loading', error: null })
                try {
                    const looksLikeUuid = /^[0-9a-fA-F-]{36}$/.test(identifier)
                    const row = looksLikeUuid
                        ? await profileService.getProfileByUserId(identifier)
                        : await profileService.getPublicProfile(identifier)

                    if (row) {
                        const ui = dbToUiProfile(row)
                        set({
                            username: ui.username,
                            profile: ui,
                            status: 'ready',
                            error: null,
                        })
                    } else {
                        set({ profile: null, status: 'ready' })
                    }
                } catch {
                    set({ error: 'Failed to fetch profile', status: 'error' })
                }
            },

            updateProfile: async (updates) => {
                const { profile } = get()
                if (!profile?.id) return
                set({ status: 'loading' })
                try {
                    // Convert UI updates back to DB input if needed
                    const dbUpdates: any = {
                        username: updates.username,
                        full_name: updates.fullName,
                        tagline: updates.tagline,
                        bio: updates.bio,
                        image_url: updates.image?.url,
                        badge: updates.badge,
                    }
                    await profileService.updateProfileById(profile.id, dbUpdates)
                    set((state) => ({
                        profile: { ...(state.profile as Profile), ...updates },
                        status: 'ready',
                        error: null,
                    }))
                } catch {
                    set({ error: 'Failed to update profile', status: 'error' })
                }
            },

            initializeUser: () => {
                const username = get().getStoredUsername()
                if (username) set({ username })
            },

            clearUser: () => {
                set({
                    session: null,
                    userId: null,
                    email: null,
                    username: '',
                    profile: null,
                    status: 'idle',
                    error: null,
                })
            },

            getStoredUsername: () => get().username,

            isProfileComplete: () => {
                const { profile } = get()
                return Boolean(profile?.fullName)
            },

            getDisplayName: () => {
                const { profile } = get()
                return profile?.fullName || 'Anonymous'
            },

            setLoading: (loading) => set({ status: loading ? 'loading' : 'ready' }),
            setError: (error) => set({ error, status: error ? 'error' : get().status }),
        }),
        {
            name: 'user-storage',
            // Only persist what’s safe/needed; do NOT persist tokens/session object
            partialize: (state) => ({
                username: state.username,
                profile: state.profile,
            }),
            version: 2,
            // (Optional) migration if you changed profile shape
            migrate: (persisted, version) => persisted,
        }
    )
)

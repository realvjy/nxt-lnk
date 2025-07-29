// hooks/useInitProfile.ts
import { useEffect } from 'react'
import { useUserStore } from '@/lib/stores/userStore'
import { supabase } from '@/supabase/client'
import { fetchProfileByUserId } from '@/lib/services/profileService'

export function useInitProfile() {
    const setSession = useUserStore((s) => s.setSession)         // add this to your store as in previous reply
    const setProfile = useUserStore((s) => s.setProfile)
    const setLoading = useUserStore((s) => s.setLoading)
    const setError = useUserStore((s) => s.setError)
    const clearUser = useUserStore((s) => s.clearUser)

    useEffect(() => {
        let cancelled = false

        async function load(sessionUserId: string | null) {
            if (!sessionUserId) {
                setProfile(null)
                setLoading(false)
                return
            }
            try {
                setLoading(true)
                const profile = await fetchProfileByUserId(sessionUserId) // now returns UserProfile | null
                if (!cancelled) setProfile(profile) // can be null (first sign-in race)
            } catch (e: any) {
                if (!cancelled) setError(e?.message || 'Failed to load profile')
            } finally {
                if (!cancelled) setLoading(false)
            }
        }

        // initial prime
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (cancelled) return
            setSession?.(session ?? null) // if you added session to store
            load(session?.user?.id ?? null)
        })

        // keep in sync with auth changes
        const { data: sub } = supabase.auth.onAuthStateChange((_evt, session) => {
            if (cancelled) return
            setSession?.(session ?? null)
            if (!session) {
                clearUser?.()
            } else {
                load(session.user.id)
            }
        })

        return () => {
            cancelled = true
            sub?.subscription?.unsubscribe()
        }
    }, [setSession, setProfile, setLoading, setError, clearUser])
}

// hooks/supabase/useProfile.ts
'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/supabase/client'
import type { Database } from '@/types/supabase/tables'
import { mapProfileFromDb } from '@/types/supabase/mappings'
import type { UserProfile } from '@/types/app/profile'

type ProfileRow = Database['public']['Tables']['profiles']['Row']
const PROFILE_COLUMNS =
    'id,user_id,username,full_name,bio,tagline,image_url,badge,layout,created_at,updated_at'

export function useProfile({ id: userId }: { id?: string }) {
    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        let cancelled = false
        if (!userId) {
            setProfile(null); setLoading(false); setError(null)
            return
        }

        ; (async () => {
            setLoading(true); setError(null)
            const { data, error } = await supabase
                .from('profiles')
                .select(PROFILE_COLUMNS)
                .eq('user_id', userId)
                .maybeSingle()               // 👈 don’t throw on no row yet
                .returns<ProfileRow>()

            if (cancelled) return
            if (error) { setError(error.message); setLoading(false); return }
            setProfile(data ? mapProfileFromDb(data) : null)
            setLoading(false)
        })()

        return () => { cancelled = true }
    }, [userId])

    return { profile, loading, error }
}

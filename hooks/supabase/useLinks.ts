// hooks/supabase/useLinks.ts
'use client'
import { useEffect } from 'react'
import { useSupabase } from '@/components/providers/SupabaseProvider'
import { useLinksStore } from '@/lib/stores/linksStore'
import { mapLinkFromDb } from '@/types/supabase/mappings'
import type { Database } from '@/types/supabase/tables'
import type { Link } from '@/types/app/links'

type LinkRow = Database['public']['Tables']['links']['Row']

export function useLinks(profileId?: string) {
    const { supabase } = useSupabase()
    const { links, setLinks, clearLinks, isLoading, error, setLoading, setError } = useLinksStore()

    useEffect(() => {
        let cancelled = false

        if (!profileId) {
            clearLinks()
            setLoading(false)
            setError(null)
            return
        }

        ; (async () => {
            setLoading(true); setError(null)
            const { data, error } = await supabase
                .from('links')
                .select('*')
                .eq('profile_id', profileId)
                .order('sort_order', { ascending: true })

            if (cancelled) return
            if (error) { setError(error.message); setLoading(false); return }

            const mapped: Link[] = (data ?? []).map((r) => mapLinkFromDb(r as LinkRow))
            setLinks(mapped)
            setLoading(false)
        })()

        return () => { cancelled = true }
    }, [profileId, supabase, setLinks, setLoading, setError, clearLinks])

    return { links, isLoading, error }
}

// hooks/supabase/useBlocks.ts
'use client'
import { useEffect, useState } from 'react'
import { useSupabase } from '@/components/providers/SupabaseProvider'
import { useBlocksStore } from '@/lib/stores/blocksStore'
import { mapBlockFromDb } from '@/types/supabase/mappings'
import type { Database } from '@/types/supabase/tables'
import type { Block } from '@/types/app/blocks'

type BlockRow = Database['public']['Tables']['blocks']['Row']

export function useBlocks(profileId?: string) {
    const { supabase } = useSupabase()
    const {
        blocks, isLoading, error,
        setLoading, setError, setBlocks,
        addBlock, updateBlock, deleteBlock, reorderBlocks, clearBlocks,
    } = useBlocksStore()

    useEffect(() => {
        let cancelled = false

        // No profile yet → no fetch
        if (!profileId) {
            clearBlocks()
            setLoading(false)
            setError(null)
            return
        }

        ; (async () => {
            setLoading(true); setError(null)
            const { data, error } = await supabase
                .from('blocks')
                .select('*')
                .eq('profile_id', profileId)
                .order('sort_order', { ascending: true })

            if (cancelled) return
            if (error) { setError(error.message); setLoading(false); return }

            const mapped: Block[] = (data ?? []).map((r) => mapBlockFromDb(r as BlockRow))
            setBlocks(mapped)
            setLoading(false)
        })()

        return () => { cancelled = true }
    }, [profileId, supabase, setBlocks, setLoading, setError, clearBlocks])

    return { blocks, isLoading, error, addBlock, updateBlock, deleteBlock, reorderBlocks }
}

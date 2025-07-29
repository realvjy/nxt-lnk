// lib/services/profileService.ts
import { supabase } from '@/supabase/client'
import type { Database } from '@/types/supabase/tables'
import { mapProfileFromDb } from '@/types/supabase/mappings' // your existing mapper
import type { UserProfile } from '@/types/app/profile'

type ProfileRow = Database['public']['Tables']['profiles']['Row']

const PROFILE_COLUMNS =
    'id,user_id,username,full_name,bio,tagline,image_url,badge,layout,created_at,updated_at'

export async function fetchProfileByUserId(userId: string): Promise<UserProfile | null> {
    if (!userId) return null

    const { data, error } = await supabase
        .from('profiles')
        .select(PROFILE_COLUMNS)
        .eq('user_id', userId)
        .maybeSingle()           // 👈 tolerate "no row yet"
        .returns<ProfileRow>()   // 👈 lock the shape for TS

    if (error) {
        // Surface the exact error while you debug (keep for now)
        console.error('fetchProfileByUserId error:', error)
        throw error
    }

    return data ? mapProfileFromDb(data) : null
}

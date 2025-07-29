// supabase/services/profile.ts
import { supabase } from '@/supabase/client'
import type { Database } from '@/types/supabase/tables'
import type { UserProfile } from '@/types/app/profile'
import type { BaseLink } from '@/types/app/links'
import type { UserPreferences } from '@/types/app/preferences'
import type { Block } from '@/types/app/blocks'
import {
    mapProfileFromDb,
    mapLinkFromDb,
    mapBlockFromDb,
    mapPreferenceFromDb,
} from '@/types/supabase/mappings'

type ProfileRow = Database['public']['Tables']['profiles']['Row']
type LinkRow = Database['public']['Tables']['links']['Row']
type BlockRow = Database['public']['Tables']['blocks']['Row']
type PrefRow = Database['public']['Tables']['preferences']['Row']

const PROFILE_COLUMNS =
    'id,user_id,username,full_name,bio,tagline,image_url,badge,layout,created_at,updated_at'

const PROFILE_WITH_RELATIONS = `
  ${PROFILE_COLUMNS},
  links(*),
  blocks(*),
  preferences(*)
`

// --- Named functions ---
export async function getProfileByUserId(userId: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
        .from('profiles')
        .select(PROFILE_COLUMNS)
        .eq('user_id', userId)
        .single()
        .returns<ProfileRow>()

    if (error?.code === 'PGRST116') return null
    if (error) throw error
    return data ? mapProfileFromDb(data) : null
}

export async function getPublicProfile(username: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
        .from('profiles')
        .select(PROFILE_COLUMNS)
        .eq('username', username)
        .maybeSingle()
        .returns<ProfileRow>()

    if (error) throw error
    return data ? mapProfileFromDb(data) : null
}

export async function getPublicProfileBundle(username: string) {
    const { data, error } = await supabase
        .from('profiles')
        .select(PROFILE_WITH_RELATIONS)
        .eq('username', username)
        .maybeSingle()
        .returns<
            ProfileRow & {
                links: LinkRow[] | null
                blocks: BlockRow[] | null
                preferences: PrefRow | null
            }
        >()

    if (error) throw error

    return {
        profile: data ? mapProfileFromDb(data) : null,
        links: (data?.links ?? []).map(mapLinkFromDb),
        blocks: (data?.blocks ?? []).map(mapBlockFromDb),
        preferences: data?.preferences ? mapPreferenceFromDb(data.preferences) : null,
    }
}

export async function updateProfileById(id: string, updates: Partial<ProfileRow>) {
    const { data, error } = await supabase
        .from('profiles')
        .update({
            username: updates.username,
            full_name: updates.full_name,
            bio: updates.bio,
            tagline: updates.tagline,
            image_url: updates.image_url,
            badge: updates.badge,
            layout: updates.layout,
        })
        .eq('id', id)
        .select(PROFILE_COLUMNS)
        .single()
        .returns<ProfileRow>()

    if (error) throw error
    return mapProfileFromDb(data)
}

// --- Keep the original profileService object ---
export const profileService = {
    getProfileByUserId,
    getPublicProfile,
    getPublicProfileBundle,
    updateProfileById,
}

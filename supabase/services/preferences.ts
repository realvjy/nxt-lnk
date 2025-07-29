import { supabase } from '../client'
import type { ThemeType, UserPreferences } from '@/types/index'
import type { Json, Preference, PreferenceInsert, PreferenceUpdate } from '@/types/supabase/tables'

export const preferenceService = {
    getPreferences: async (profileId: string): Promise<UserPreferences | null> => {
        const { data } = await supabase
            .from('preferences')
            .select('*')
            .eq('profile_id', profileId)
            .single()

        return data ? convertToUserPreferences(data) : null
    },

    updatePreferences: async (profileId: string, preferences: Partial<UserPreferences>) => {
        const supaPrefs = convertToSupabasePreferences(profileId, preferences)
        const { data } = await supabase
            .from('preferences')
            .upsert(supaPrefs)
            .select()
            .single()
        return data ? convertToUserPreferences(data) : null
    },

    // Initialize default preferences for a new user
    initializePreferences: async (profileId: string) => {
        const defaultPrefs: PreferenceInsert = {
            profile_id: profileId,
            theme: 'light',
            settings: {
                layout: 'default',
                color: '#000000',
                font: 'inter'
            }
        }

        const { data } = await supabase
            .from('preferences')
            .insert(defaultPrefs)
            .select()
            .single()
        return data ? convertToUserPreferences(data) : null
    }
}

const convertToUserPreferences = (data: Preference): UserPreferences => {
    return {
        profileId: data.profile_id,
        theme: data.theme as ThemeType,
        settings: (data.settings as UserPreferences['settings']) || {},
        createdAt: data.created_at,
        updatedAt: data.updated_at,
    }
}

const convertToSupabasePreferences = (profileId: string, prefs: Partial<UserPreferences>): PreferenceUpdate => {
    return {
        profile_id: profileId,
        theme: prefs.theme,
        settings: prefs.settings as Json
    }
}
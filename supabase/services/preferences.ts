// /lib/supabase/services/preferences.ts
import { supabase } from '../client'
import { UserPreferences, Preference, PreferenceInsert, PreferenceUpdate } from '../types'

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
        return await supabase
            .from('preferences')
            .upsert(supaPrefs)
            .select()
            .single()
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

        return await supabase
            .from('preferences')
            .insert(defaultPrefs)
            .select()
            .single()
    }
}

const convertToUserPreferences = (data: Preference): UserPreferences => {
    return {
        theme: data.theme,
        settings: data.settings as UserPreferences['settings']
    }
}

const convertToSupabasePreferences = (profileId: string, prefs: Partial<UserPreferences>): PreferenceUpdate => {
    return {
        profile_id: profileId,
        theme: prefs.theme,
        settings: prefs.settings
    }
}
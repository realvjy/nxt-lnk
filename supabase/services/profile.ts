import { UserProfile } from '@/shared/index';
import { supabase } from '../client'
import type { Profile as SupabaseProfile } from '@/shared/supabase/tables'

// Convert Supabase Profile to our UserProfile type
const convertToUserProfile = (profile: SupabaseProfile | null): UserProfile | null => {
    if (!profile) return null;

    return {
        id: profile.id,
        username: profile.username,
        fullName: profile.full_name || '',
        bio: profile.bio || '',
        tagline: profile.tagline || '',
        image: profile.image_url ? {
            url: profile.image_url,
            alt: profile.full_name || profile.username
        } : undefined,
        badge: profile.badge as any || undefined,
        createdAt: profile.created_at,
        updatedAt: profile.updated_at
    }
}

// Convert our UserProfile type to Supabase Profile type
const convertToSupabaseProfile = (profile: Partial<UserProfile>): Partial<SupabaseProfile> => {
    return {
        full_name: profile.fullName,
        bio: profile.bio,
        tagline: profile.tagline,
        image_url: profile.image?.url,
        badge: profile.badge,
        // Don't include username as it's used as identifier
        // Don't include created_at/updated_at as they're managed by Supabase
    }
}

export const profileService = {
    getProfile: async (username: string): Promise<UserProfile | null> => {
        const { data } = await supabase
            .from('profiles')
            .select('*, links(*), blocks(*), preferences(*)')
            .eq('username', username)
            .single()
        return convertToUserProfile(data)
    },
    getProfileById: async (id: string) => {
        const { data } = await supabase
            .from('profiles')
            .select('*, links(*), blocks(*), preferences(*)')
            .eq('id', id)
            .single();
        return convertToUserProfile(data); // <-- use the converter for consistency
    },
    updateProfile: async (username: string, profile: Partial<UserProfile>) => {
        const supabaseData = convertToSupabaseProfile(profile)
        return await supabase
            .from('profiles')
            .update(supabaseData)
            .eq('username', username)
    },
    updateProfileById: async (id: string, profile: Partial<UserProfile>) => {
        const supabaseData = convertToSupabaseProfile(profile)
        return await supabase
            .from('profiles')
            .update(supabaseData)
            .eq('id', id)
    }
}
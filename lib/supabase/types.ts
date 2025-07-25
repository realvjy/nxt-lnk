// /lib/supabase/types.ts

// Basic JSON type
export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

// Database Schema Types
export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string
                    user_id: string
                    username: string
                    full_name: string | null
                    bio: string | null
                    tagline: string | null
                    image_url: string | null
                    badge: string | null
                    layout: Json | null
                    created_at: string
                    updated_at: string
                }
                Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'id' | 'created_at' | 'updated_at'>
                Update: Partial<Database['public']['Tables']['profiles']['Insert']>
            }
            links: {
                Row: {
                    id: string
                    profile_id: string
                    type: string
                    url: string
                    title: string
                    sort_order: number
                    is_active: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: Omit<Database['public']['Tables']['links']['Row'], 'id' | 'created_at' | 'updated_at'>
                Update: Partial<Database['public']['Tables']['links']['Insert']>
            }
            blocks: {
                Row: {
                    id: string
                    profile_id: string
                    type: string
                    content: Json
                    sort_order: number
                    settings: Json | null
                    created_at: string
                    updated_at: string
                }
                Insert: Omit<Database['public']['Tables']['blocks']['Row'], 'id' | 'created_at' | 'updated_at'>
                Update: Partial<Database['public']['Tables']['blocks']['Insert']>
            }
            preferences: {
                Row: {
                    profile_id: string
                    theme: string
                    settings: Json | null
                    created_at: string
                    updated_at: string
                }
                Insert: Omit<Database['public']['Tables']['preferences']['Row'], 'created_at' | 'updated_at'>
                Update: Partial<Database['public']['Tables']['preferences']['Insert']>
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
    }
}

// Helper Types for Database Tables
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
export type TablesRow<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']

// Database Row Types
export type Profile = TablesRow<'profiles'>
export type DatabaseLink = TablesRow<'links'>
export type DatabaseBlock = TablesRow<'blocks'>
export type Preference = TablesRow<'preferences'>

// App Types - Profile
export interface ProfileImage {
    url: string
    alt?: string
}

export interface UserProfile {
    id?: string
    userId?: string
    username: string
    fullName: string
    bio: string
    tagline: string
    image?: ProfileImage
    badge?: string
    layout?: Json
    createdAt?: string
    updatedAt?: string
}

// App Types - Links
export type LinkType = 'social' | 'normal' | 'blog'
export type SocialPlatform =
    | 'twitter'
    | 'instagram'
    | 'facebook'
    | 'linkedin'
    | 'github'
    | 'youtube'
    | 'tiktok'
    | 'dribbble'
    | 'behance'
    | 'medium'
    | 'other'

export interface BaseLink {
    id: string
    profileId: string
    type: LinkType
    url: string
    title: string
    sortOrder: number
    isActive: boolean
    createdAt?: string
    updatedAt?: string
    // App-only fields for UI/display
    label?: string
    icon?: string
    image?: string
    cover?: string
    platform?: SocialPlatform
    description?: string
    publishDate?: string
}

export interface SocialLink extends BaseLink {
    type: 'social'
    platform: SocialPlatform
}

export interface BlogLink extends BaseLink {
    type: 'blog'
    description?: string
    publishDate?: string
    cover?: string
}

export interface NormalLink extends BaseLink {
    type: 'normal'
}

export type Link = SocialLink | BlogLink | NormalLink

// App Types - Blocks
export interface Block {
    id: string
    profileId: string
    type: string
    content: Json
    sortOrder: number
    settings?: Json
    createdAt?: string
    updatedAt?: string
}

// App Types - Preferences
export interface UserPreferences {
    profileId: string
    theme: string
    settings: {
        layout?: string
        color?: string
        font?: string
        [key: string]: any
    }
    createdAt?: string
    updatedAt?: string
}

// Insert/Update Types
export type ProfileInsert = TablesInsert<'profiles'>
export type LinkInsert = TablesInsert<'links'>
export type BlockInsert = TablesInsert<'blocks'>
export type PreferenceInsert = TablesInsert<'preferences'>

export type ProfileUpdate = TablesUpdate<'profiles'>
export type LinkUpdate = TablesUpdate<'links'>
export type BlockUpdate = TablesUpdate<'blocks'>
export type PreferenceUpdate = TablesUpdate<'preferences'>

// Mapping Functions
export function mapProfileFromDb(row: Profile): UserProfile {
    return {
        id: row.id,
        userId: row.user_id,
        username: row.username,
        fullName: row.full_name || '',
        bio: row.bio || '',
        tagline: row.tagline || '',
        image: row.image_url ? { url: row.image_url } : undefined,
        badge: row.badge || undefined,
        layout: row.layout,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    }
}

export function mapLinkFromDb(row: DatabaseLink): Link {
    const baseLink: BaseLink = {
        id: row.id,
        profileId: row.profile_id,
        type: row.type as LinkType,
        url: row.url,
        title: row.title,
        sortOrder: row.sort_order,
        isActive: row.is_active,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    }

    return baseLink as Link
}

export function mapBlockFromDb(row: DatabaseBlock): Block {
    return {
        id: row.id,
        profileId: row.profile_id,
        type: row.type,
        content: row.content,
        sortOrder: row.sort_order,
        settings: row.settings,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    }
}

export function mapPreferenceFromDb(row: Preference): UserPreferences {
    return {
        profileId: row.profile_id,
        theme: row.theme,
        settings: (row.settings as any) || {},
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    }
}
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
                    username: string
                    full_name: string | null
                    bio: string | null
                    tagline: string | null
                    image_url: string | null
                    badge: string | null
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
                    type: 'social' | 'normal' | 'blog'
                    url: string
                    title: string
                    order: number
                    is_active: boolean
                    platform?: string
                    description?: string
                    publish_date?: string
                    created_at: string
                }
                Insert: Omit<Database['public']['Tables']['links']['Row'], 'id' | 'created_at'>
                Update: Partial<Database['public']['Tables']['links']['Insert']>
            }
            blocks: {
                Row: {
                    id: string
                    profile_id: string
                    type: string
                    content: Json
                    order: number
                    settings: Json | null
                    created_at: string
                }
                Insert: Omit<Database['public']['Tables']['blocks']['Row'], 'id' | 'created_at'>
                Update: Partial<Database['public']['Tables']['blocks']['Insert']>
            }
            preferences: {
                Row: {
                    profile_id: string
                    theme: string
                    settings: Json
                    updated_at: string
                }
                Insert: Omit<Database['public']['Tables']['preferences']['Row'], 'updated_at'>
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
    username: string
    fullName: string
    bio: string
    tagline: string
    image?: ProfileImage
    badge?: string
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
    label: string
    url: string
    type: LinkType
    icon?: string
    image?: string
    cover?: string
    position: number
    createdAt?: string
    updatedAt?: string
}

export interface SocialLink extends BaseLink {
    type: 'social'
    platform: SocialPlatform
}

export interface BlogLink extends BaseLink {
    type: 'blog'
    description?: string
    publishDate?: string
}

export interface NormalLink extends BaseLink {
    type: 'normal'
}

export type Link = SocialLink | BlogLink | NormalLink

// App Types - Blocks
export interface Block {
    id: string
    type: string
    content: Json
    order: number
    settings?: Json
    createdAt?: string
}

// App Types - Preferences
export interface UserPreferences {
    theme: string
    settings: {
        layout?: string
        color?: string
        font?: string
        [key: string]: any
    }
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
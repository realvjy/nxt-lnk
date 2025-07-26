// Database JSON type
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
                    platform: string | null
                    cover: string | null
                    description: string | null
                }
                Insert: Omit<Database['public']['Tables']['links']['Row'], 'id' | 'created_at' | 'updated_at'>
                Update: Partial<Database['public']['Tables']['links']['Insert']>
            }
            blocks: {
                Row: {
                    id: string
                    profile_id: string
                    type: string
                    content: Json | null
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

// Insert/Update Types
export type ProfileInsert = TablesInsert<'profiles'>
export type LinkInsert = TablesInsert<'links'>
export type BlockInsert = TablesInsert<'blocks'>
export type PreferenceInsert = TablesInsert<'preferences'>

export type ProfileUpdate = TablesUpdate<'profiles'>
export type LinkUpdate = TablesUpdate<'links'>
export type BlockUpdate = TablesUpdate<'blocks'>
export type PreferenceUpdate = TablesUpdate<'preferences'>
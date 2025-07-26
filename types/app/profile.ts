import { Json } from '../supabase/tables';

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

// Renamed to avoid naming conflict with UserPreferences in preferences.ts
export interface ProfilePreferences {
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
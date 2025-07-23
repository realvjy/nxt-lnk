// User profile type definitions

/**
 * Badge types for user profiles
 */
export type BadgeType = 'exclusive' | 'live' | 'available' | 'busy' | 'away' | 'offline' | 'custom'

/**
 * User profile image type
 */
export interface ProfileImage {
    url: string
    alt?: string
}

/**
 * Complete user profile information
 */
export interface UserProfile {
    // Core identity
    username: string
    fullName: string

    // Profile content
    bio: string
    tagline: string

    // Visual elements
    image?: ProfileImage
    badge?: BadgeType

    // Metadata
    createdAt?: string
    updatedAt?: string
}

/**
 * Partial user profile for updates
 */
export type PartialUserProfile = Partial<UserProfile>
// Link type definitions

/**
 * Link types categorization
 */
export type LinkType = 'social' | 'normal' | 'blog'

/**
 * Social media platform types
 * Can be expanded as needed
 */
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

/**
 * Base link interface with common properties
 */
export interface BaseLink {
    id: string
    label: string
    url: string
    type: LinkType
    icon?: string        // Icon path or name
    image?: string       // Custom image URL
    cover?: string       // Cover/background image URL
    position: number     // For ordering links
    createdAt?: string
    updatedAt?: string
}

/**
 * Social media specific link
 */
export interface SocialLink extends BaseLink {
    type: 'social'
    platform: SocialPlatform
}

/**
 * Blog specific link
 */
export interface BlogLink extends BaseLink {
    type: 'blog'
    description?: string
    publishDate?: string
}

/**
 * Normal link (default)
 */
export interface NormalLink extends BaseLink {
    type: 'normal'
}

/**
 * Union type for all link types
 */
export type Link = SocialLink | BlogLink | NormalLink

/**
 * Collection of links for a user
 */
export interface LinksCollection {
    userId: string
    links: Link[]
}
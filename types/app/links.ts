import { Activatable, ProfileAssociated, Sortable, Timestamped } from './shared';
import { Json } from '../supabase/tables';

// Link Types
export type LinkType = 'social' | 'normal' | 'blog';

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
    | 'twitch'
    | 'medium'
    | 'other';

// Base Link Interface with common properties
export interface BaseLink extends Sortable, ProfileAssociated, Activatable, Timestamped {
    id: string;
    type: LinkType;
    url: string;
    title: string;

    // Optional fields that can be in any link type
    cover?: string;
    description?: string;
    icon?: string;
    image?: string;
    label?: string;
}

// Social Link Type
export interface SocialLink extends BaseLink {
    type: 'social';
    platform: SocialPlatform;
}

// Blog Link Type
export interface BlogLink extends BaseLink {
    type: 'blog';
    publishDate?: string;
}

// Normal Link Type
export interface NormalLink extends BaseLink {
    type: 'normal';
}

// Union type for all link types
export type Link = SocialLink | BlogLink | NormalLink;

// Type Guards
export function isSocialLink(link: BaseLink): link is SocialLink {
    return link.type === 'social';
}

export function isBlogLink(link: BaseLink): link is BlogLink {
    return link.type === 'blog';
}

export function isNormalLink(link: BaseLink): link is NormalLink {
    return link.type === 'normal';
}

/**
 * Create a new link with default values
 */
export function createLink(type: LinkType, params: Partial<BaseLink> = {}): Link {
    const baseLink: BaseLink = {
        id: crypto.randomUUID(),
        profileId: params.profileId || '',
        type,
        url: params.url || '',
        title: params.title || '',
        sortOrder: params.sortOrder || 0,
        isActive: params.isActive !== undefined ? params.isActive : true,
        ...params
    };

    switch (type) {
        case 'social':
            return {
                ...baseLink,
                type: 'social',
                platform: (params as Partial<SocialLink>).platform || 'other'
            } as SocialLink;
        case 'blog':
            return {
                ...baseLink,
                type: 'blog',
            } as BlogLink;
        default:
            return {
                ...baseLink,
                type: 'normal'
            } as NormalLink;
    }
}
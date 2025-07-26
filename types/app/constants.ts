/**
 * Application constants
 */
import { SocialPlatform } from './links';
import { BadgeType, ThemeType } from './shared';

/**
 * Default profile settings
 */
export const DEFAULT_PROFILE = {
    username: '',
    fullName: '',
    bio: '',
    tagline: '',
    imageUrl: '',
    badge: 'available' as BadgeType,
};

/**
 * Default theme
 */
export const DEFAULT_THEME: ThemeType = 'system';

/**
 * Social platform metadata
 */
export const SOCIAL_PLATFORMS: Record<SocialPlatform, {
    name: string;
    icon: string;
    color: string;
    baseUrl?: string;
}> = {
    twitter: {
        name: 'Twitter',
        icon: 'twitter',
        color: '#1DA1F2',
        baseUrl: 'https://twitter.com/'
    },
    instagram: {
        name: 'Instagram',
        icon: 'instagram',
        color: '#E1306C',
        baseUrl: 'https://instagram.com/'
    },
    facebook: {
        name: 'Facebook',
        icon: 'facebook',
        color: '#1877F2',
        baseUrl: 'https://facebook.com/'
    },
    linkedin: {
        name: 'LinkedIn',
        icon: 'linkedin',
        color: '#0A66C2',
        baseUrl: 'https://linkedin.com/in/'
    },
    github: {
        name: 'GitHub',
        icon: 'github',
        color: '#333333',
        baseUrl: 'https://github.com/'
    },
    dribbble: {
        name: 'Dribbble',
        icon: 'dribbble',
        color: '#EA4C89',
        baseUrl: 'https://dribbble.com/'
    },
    behance: {
        name: 'Behance',
        icon: 'behance',
        color: '#1769FF',
        baseUrl: 'https://behance.net/'
    },
    youtube: {
        name: 'YouTube',
        icon: 'youtube',
        color: '#FF0000',
        baseUrl: 'https://youtube.com/'
    },
    medium: {
        name: 'Medium',
        icon: 'medium',
        color: '#000000',
        baseUrl: 'https://medium.com/@'
    },
    twitch: {
        name: 'Twitch',
        icon: 'twitch',
        color: '#9146FF',
        baseUrl: 'https://twitch.tv/'
    },
    tiktok: {
        name: 'TikTok',
        icon: 'tiktok',
        color: '#000000',
        baseUrl: 'https://tiktok.com/@'
    },
    other: {
        name: 'Other',
        icon: 'link',
        color: '#666666'
    }
};

/**
 * Badge type metadata
 */
export const BADGE_TYPES: Record<BadgeType, {
    label: string;
    color: string;
    icon: string;
}> = {
    exclusive: {
        label: 'Exclusive',
        color: '#FFD700',
        icon: 'star'
    },
    live: {
        label: 'Live',
        color: '#FF0000',
        icon: 'radio'
    },
    available: {
        label: 'Available',
        color: '#00C853',
        icon: 'check-circle'
    },
    busy: {
        label: 'Busy',
        color: '#FF9800',
        icon: 'clock'
    },
    away: {
        label: 'Away',
        color: '#757575',
        icon: 'minus-circle'
    },
    offline: {
        label: 'Offline',
        color: '#BDBDBD',
        icon: 'x-circle'
    }
};

/**
 * Local storage keys
 */
export const STORAGE_KEYS = {
    PROFILE: 'lnks-profile',
    BLOCKS: 'lnks-blocks',
    LINKS: 'lnks-links',
    PREFERENCES: 'lnks-preferences',
    AUTH: 'lnks-auth',
    THEME: 'lnks-theme'
};

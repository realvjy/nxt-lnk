/**
 * Common types used across the application
 */

/**
 * Image type used in profiles and blocks
 */
export interface Image {
    url: string;
    alt?: string;
    width?: number;
    height?: number;
}

/**
 * Theme options for the application
 */
export type ThemeType = 'light' | 'dark' | 'system';

/**
 * Layout configuration
 */
export interface LayoutConfig {
    spacing: 'compact' | 'normal' | 'relaxed';
    width: 'narrow' | 'normal' | 'wide';
    background?: string;
    backgroundImage?: string;
    textColor?: string;
    accentColor?: string;
    fontFamily?: string;
}

/**
 * Badge types for profile status
 */
export type BadgeType = 'exclusive' | 'live' | 'available' | 'busy' | 'away' | 'offline';

/**
 * Device types for responsive design
 */
export type DeviceType = 'mobile' | 'tablet' | 'desktop';

/**
 * Base interface for items that can be sorted
 */
export interface Sortable {
    id: string;
    sortOrder: number;
}

/**
 * Base interface for items with timestamps
 */
export interface Timestamped {
    createdAt?: string;
    updatedAt?: string;
}

/**
 * Base interface for items with profile association
 */
export interface ProfileAssociated {
    profileId: string;
}

/**
 * Base interface for items that can be active/inactive
 */
export interface Activatable {
    isActive: boolean;
}

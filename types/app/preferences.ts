import { ThemeType, LayoutConfig } from './shared';
import { Json } from '../supabase/tables';

/**
 * User preferences interface
 */
export interface UserPreferences {
    profileId: string;
    theme: ThemeType;
    settings?: UserSettings;
    createdAt?: string;
    updatedAt?: string;
}

/**
 * User settings interface
 */
export interface UserSettings {
    layout?: LayoutConfig;
    notifications?: NotificationSettings;
    privacy?: PrivacySettings;
    customization?: CustomizationSettings;
    analytics?: AnalyticsSettings;
}

/**
 * Notification settings
 */
export interface NotificationSettings {
    email: boolean;
    push: boolean;
    linkClicks: boolean;
    profileViews: boolean;
}

/**
 * Privacy settings
 */
export interface PrivacySettings {
    isPublic: boolean;
    showAnalytics: boolean;
    allowIndexing: boolean;
}

/**
 * Customization settings
 */
export interface CustomizationSettings {
    fontFamily?: string;
    buttonStyle?: 'rounded' | 'square' | 'pill';
    animationsEnabled: boolean;
}

/**
 * Analytics settings
 */
export interface AnalyticsSettings {
    trackPageViews: boolean;
    trackLinkClicks: boolean;
    trackGeolocation: boolean;
}

/**
 * Create default user preferences
 */
export function createDefaultPreferences(profileId: string): UserPreferences {
    return {
        profileId,
        theme: 'system',
        settings: {
            layout: {
                spacing: 'normal',
                width: 'normal'
            },
            notifications: {
                email: true,
                push: true,
                linkClicks: true,
                profileViews: true
            },
            privacy: {
                isPublic: true,
                showAnalytics: false,
                allowIndexing: true
            },
            customization: {
                animationsEnabled: true,
                buttonStyle: 'rounded'
            },
            analytics: {
                trackPageViews: true,
                trackLinkClicks: true,
                trackGeolocation: false
            }
        }
    };
}

/**
 * Convert user preferences to database format
 */
export function preferencesToDb(preferences: UserPreferences): {
    profile_id: string;
    theme: string;
    settings: Json;
} {
    return {
        profile_id: preferences.profileId,
        theme: preferences.theme,
        settings: preferences.settings as Json
    };
}

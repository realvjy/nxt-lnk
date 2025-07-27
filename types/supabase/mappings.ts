import { Profile, DatabaseLink, DatabaseBlock, Preference, Json } from './tables';
import { UserProfile, ProfilePreferences } from '../app/profile';
import { BaseLink, SocialLink, NormalLink, SocialPlatform } from '../app/links';
import { UserPreferences } from '../app/preferences';
import { Block } from '../app/blocks';
import { ThemeType } from '../app/shared';

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

export function mapLinkFromDb(row: DatabaseLink): BaseLink {
    // Determine if it's a social link based on platform field
    if (row.platform) {
        return {
            id: row.id,
            profileId: row.profile_id,
            type: 'social',
            url: row.url,
            title: row.title,
            sortOrder: row.sort_order,
            isActive: row.is_active,
            platform: row.platform as SocialPlatform,
            cover: row.cover || undefined,
            description: row.description || undefined,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
        } as SocialLink;
    }

    // Otherwise it's a normal link
    return {
        id: row.id,
        profileId: row.profile_id,
        type: 'normal',
        url: row.url,
        title: row.title,
        sortOrder: row.sort_order,
        isActive: row.is_active,
        cover: row.cover || undefined,
        description: row.description || undefined,

        createdAt: row.created_at,
        updatedAt: row.updated_at,
    } as NormalLink;
}

export function mapBlockFromDb(row: DatabaseBlock): Block {
    // Cast the type to the expected string literal union type
    const blockType = row.type as 'name' | 'bio' | 'link' | 'tagline' | 'image' | 'badge';

    return {
        id: row.id,
        profileId: row.profile_id,
        type: blockType,
        content: row.content as any || {}, // Use type assertion for content
        sortOrder: row.sort_order,
        settings: row.settings as any || {}, // Use type assertion for settings
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    } as Block;
}

export function mapPreferenceFromDb(row: Preference): UserPreferences {
    return {
        profileId: row.profile_id,
        theme: row.theme as ThemeType,
        settings: (row.settings as any) || {},
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    }
}

// Mapping to DB format
export function mapLinkToDb(link: BaseLink): Omit<DatabaseLink, 'id' | 'created_at' | 'updated_at'> {
    const baseFields = {
        profile_id: link.profileId,
        type: link.type,
        url: link.url,
        title: link.title,
        sort_order: link.sortOrder,
        is_active: link.isActive,
        cover: link.cover || null,
        description: link.description || null,
    };

    // Add platform field for social links
    if (link.type === 'social') {
        return {
            ...baseFields,
            platform: (link as SocialLink).platform,
        };
    }

    return {
        ...baseFields,
        platform: null,
    };
}

export function mapBlockToDb(block: Block): Omit<DatabaseBlock, 'id' | 'created_at' | 'updated_at'> {
    return {
        profile_id: block.profileId,
        type: block.type,
        content: block.content || null,
        sort_order: block.sortOrder,
        settings: block.settings || null,
    }
}
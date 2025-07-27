import { UserProfile } from './profile';
import { Link, LinkType, SocialPlatform } from './links';
import { Json } from '../supabase/tables';
import { User, Tag, Type, Image, Shield, Link2, LucideIcon } from 'lucide-react';

// Define block types with metadata
export const blockTypes = [
    { type: 'name', label: 'Name', icon: User, description: 'Add your full name' },
    { type: 'tagline', label: 'Tagline', icon: Tag, description: 'Add a tagline or title' },
    { type: 'bio', label: 'Bio', icon: Type, description: 'Add a bio or description' },
    { type: 'image', label: 'Image', icon: Image, description: 'Add profile image' },
    { type: 'badge', label: 'Badge', icon: Shield, description: 'Add status badge' },
    { type: 'link', label: 'Link', icon: Link2, description: 'Add a link' },
];


/**
 * Base block interface with common properties
 */
export interface BaseBlock {
    id: string
    profileId: string
    type: string
    sortOrder: number
    content?: Json
    settings?: Json
    createdAt?: string
    updatedAt?: string
}

/**
 * Name block for displaying user's name
 */
export interface NameBlockType extends BaseBlock {
    type: 'name'
    content: {
        text: string
    }
}

/**
 * Enhanced bio block with rich text content
 */
export interface BioBlockType extends BaseBlock {
    type: 'bio'
    content: {
        text: string
    }
}

/**
 * Enhanced link block with additional properties
 */
export interface LinkBlockType extends BaseBlock {
    type: 'link'
    content: {
        label: string
        url: string
        icon?: string
        image?: string
        cover?: string
        linkType?: LinkType
        platform?: SocialPlatform
    }
}

/**
 * Tagline block for short description
 */
export interface TaglineBlockType extends BaseBlock {
    type: 'tagline'
    content: {
        text: string
    }
}

/**
 * Profile image block
 */
export interface ImageBlockType extends BaseBlock {
    type: 'image'
    content: {
        url: string
        alt?: string
    }
}

/**
 * Badge block for status indicators
 */
export interface BadgeBlockType extends BaseBlock {
    type: 'badge'
    content: {
        type: 'exclusive' | 'live' | 'available' | 'busy' | 'away' | 'offline'
        text?: string
    }
}

/**
 * Union type of all specific block types
 */
export type SpecificBlock =
    | NameBlockType
    | BioBlockType
    | LinkBlockType
    | TaglineBlockType
    | ImageBlockType
    | BadgeBlockType;

/**
 * Union type for all block types
 */
export type Block =
    | NameBlockType
    | BioBlockType
    | LinkBlockType
    | TaglineBlockType
    | ImageBlockType
    | BadgeBlockType

/**
 * Helper function to check if a block is a specific type
 */
export function isBlockType<T extends SpecificBlock>(
    block: Block,
    type: T['type']
): block is T {
    return block.type === type;
}

/**
 * Helper functions for specific block types
 */
export function isNameBlock(block: Block): block is NameBlockType {
    return isBlockType(block, 'name');
}

export function isBioBlock(block: Block): block is BioBlockType {
    return isBlockType(block, 'bio');
}

export function isLinkBlock(block: Block): block is LinkBlockType {
    return isBlockType(block, 'link');
}

export function isTaglineBlock(block: Block): block is TaglineBlockType {
    return isBlockType(block, 'tagline');
}

export function isImageBlock(block: Block): block is ImageBlockType {
    return block.type === 'image';
}

export function isBadgeBlock(block: Block): block is BadgeBlockType {
    return block.type === 'badge';
}

/**
 * Helper function to create a new block with default values
 */
export const createBlock = (type: Block['type'], props: any = {}): Block => {
    // Generate a proper UUID v4 format that Supabase expects
    const id = crypto.randomUUID();

    switch (type) {
        case 'name':
            return { id, type, content: { text: props.text || '' } } as NameBlockType
        case 'bio':
            return { id, type, content: { text: props.text || '' } } as BioBlockType
        case 'link':
            return {
                id,
                type,
                content: {
                    label: props.label || '',
                    url: props.url || '',
                    icon: props.icon,
                    image: props.image,
                    cover: props.cover,
                    linkType: props.linkType || 'normal',
                    platform: props.platform
                }
            } as LinkBlockType
        case 'tagline':
            return { id, type, content: { text: props.text || '' } } as TaglineBlockType
        case 'image':
            return { id, type, content: { url: props.url || '', alt: props.alt } } as ImageBlockType
        case 'badge':
            return { id, type, content: { type: props.type || 'available', text: props.text } } as BadgeBlockType
        default:
            throw new Error(`Unknown block type: ${type}`)
    }
}

/**
 * Convert profile data to blocks
 */
export const profileToBlocks = (profile: UserProfile): Block[] => {
    const blocks: Block[] = []

    if (profile.fullName) {
        blocks.push(createBlock('name', { text: profile.fullName }))
    }

    if (profile.tagline) {
        blocks.push(createBlock('tagline', { text: profile.tagline }))
    }

    if (profile.bio) {
        blocks.push(createBlock('bio', { text: profile.bio }))
    }

    if (profile.image) {
        blocks.push(createBlock('image', { url: profile.image.url, alt: profile.image.alt }))
    }

    if (profile.badge) {
        blocks.push(createBlock('badge', { type: profile.badge }))
    }

    return blocks
}

/**
 * Convert links to link blocks
 */
export const linksToBlocks = (links: Link[]): LinkBlockType[] => {
    return links.map(link => {
        return createBlock('link', {
            label: link.label,
            url: link.url,
            icon: link.icon,
            image: link.image,
            cover: link.cover,
            linkType: link.type,
            platform: 'platform' in link ? link.platform : undefined
        }) as LinkBlockType
    })
}
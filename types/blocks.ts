// shared/blocks.ts - Fixed version
import { UserProfile } from './profile/user'
import { Link } from './profile/links'

/**
 * Base block type with common properties
 */
export interface BaseBlock {
    id: string
    type: string
}

/**
 * Name block for displaying user's name
 */
export interface NameBlockType extends BaseBlock {
    type: 'name'
    props: {
        text: string
    }
}

/**
 * Enhanced bio block with rich text content
 */
export interface BioBlockType extends BaseBlock {
    type: 'bio'
    props: {
        text: string
    }
}

/**
 * Enhanced link block with additional properties
 */
export interface LinkBlockType extends BaseBlock {
    type: 'link'
    props: {
        label: string
        url: string
        icon?: string
        image?: string
        cover?: string
        linkType?: 'social' | 'normal' | 'blog'
        platform?: string
    }
}

/**
 * Tagline block for short description
 */
export interface TaglineBlockType extends BaseBlock {
    type: 'tagline'
    props: {
        text: string
    }
}

/**
 * Profile image block
 */
export interface ImageBlockType extends BaseBlock {
    type: 'image'
    props: {
        url: string
        alt?: string
    }
}

/**
 * Badge block for status indicators
 */
export interface BadgeBlockType extends BaseBlock {
    type: 'badge'
    props: {
        type: 'exclusive' | 'live' | 'available' | 'busy' | 'away' | 'offline'
        text?: string
    }
}

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
 * Helper function to create a new block with default values
 */
export const createBlock = (type: Block['type'], props: any = {}): Block => {
    const id = `block_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`

    switch (type) {
        case 'name':
            return { id, type, props: { text: props.text || '' } } as NameBlockType
        case 'bio':
            return { id, type, props: { text: props.text || '' } } as BioBlockType
        case 'link':
            return {
                id,
                type,
                props: {
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
            return { id, type, props: { text: props.text || '' } } as TaglineBlockType
        case 'image':
            return { id, type, props: { url: props.url || '', alt: props.alt } } as ImageBlockType
        case 'badge':
            return { id, type, props: { type: props.type || 'available', text: props.text } } as BadgeBlockType
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
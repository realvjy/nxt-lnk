import { Block } from '@/shared/blocks'

export const createBlock = (type: Block['type'], props: any = {}): Block => {
    const id = `block_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`

    const defaultProps = {
        name: { text: '' },
        bio: { text: '' },
        link: {
            label: '',
            url: '',
            linkType: 'normal' as const
        },
        tagline: { text: '' },
        image: { url: '', alt: '' },
        badge: { type: 'available' as const, text: '' }
    }

    return {
        id,
        type,
        props: { ...defaultProps[type], ...props }
    } as Block
}

export const validateBlock = (block: Block): boolean => {
    // Add validation logic for each block type
    switch (block.type) {
        case 'name':
            return !!block.props.text
        case 'link':
            return !!(block.props.label && block.props.url)
        case 'image':
            return !!block.props.url
        default:
            return true
    }
}

export const getBlockIcon = (type: Block['type']) => {
    const icons = {
        name: 'User',
        tagline: 'Tag',
        bio: 'Type',
        image: 'Image',
        badge: 'Tag',
        link: 'Link2'
    }
    return icons[type] || 'Square'
}
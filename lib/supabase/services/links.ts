// /lib/supabase/services/links.ts
import { supabase } from '../client'
import {
    Link,
    LinkType,
    TablesInsert,
    DatabaseLink,
    SocialLink,
    BlogLink,
    NormalLink
} from '../types'

export const linkService = {
    getLinks: async (profileId: string): Promise<Link[]> => {
        const { data } = await supabase
            .from('links')
            .select('*')
            .eq('profile_id', profileId)
            .order('order', { ascending: true })

        return data?.map(convertToLink) || []
    },

    createLink: async (profileId: string, link: Omit<Link, 'id' | 'createdAt'>) => {
        const supabaseLink = convertToSupabaseLink(profileId, link)
        return await supabase
            .from('links')
            .insert(supabaseLink)
            .select()
            .single()
    },

    updateLink: async (id: string, link: Partial<Link>) => {
        const supabaseLink = convertToSupabaseLinkUpdate(link)
        return await supabase
            .from('links')
            .update(supabaseLink)
            .eq('id', id)
            .select()
            .single()
    },

    deleteLink: async (id: string) => {
        return await supabase
            .from('links')
            .delete()
            .eq('id', id)
    },

    reorderLinks: async (profileId: string, linkOrders: { id: string, order: number }[]) => {
        const updates = linkOrders.map(({ id, order }) => ({
            id,
            order,
            profile_id: profileId
        }))

        return await supabase
            .from('links')
            .upsert(updates)
    }
}

const convertToLink = (data: DatabaseLink): Link => {
    const base = {
        id: data.id,
        label: data.title,
        url: data.url,
        type: data.type as LinkType,
        position: data.order,
        createdAt: data.created_at
    }

    switch (data.type) {
        case 'social':
            return {
                ...base,
                type: 'social',
                platform: data.platform as SocialLink['platform']
            }
        case 'blog':
            return {
                ...base,
                type: 'blog',
                description: data.description,
                publishDate: data.publish_date
            }
        default:
            return {
                ...base,
                type: 'normal'
            }
    }
}

const convertToSupabaseLink = (profileId: string, link: Omit<Link, 'id' | 'createdAt'>): TablesInsert<'links'> => {
    const base = {
        profile_id: profileId,
        title: link.label,
        url: link.url,
        type: link.type,
        order: link.position,
        is_active: true
    }

    switch (link.type) {
        case 'social':
            return {
                ...base,
                platform: (link as Omit<SocialLink, 'id' | 'createdAt'>).platform
            }
        case 'blog':
            return {
                ...base,
                description: (link as Omit<BlogLink, 'id' | 'createdAt'>).description,
                publish_date: (link as Omit<BlogLink, 'id' | 'createdAt'>).publishDate
            }
        default:
            return base
    }
}

const convertToSupabaseLinkUpdate = (link: Partial<Link>) => {
    const update: any = {}

    if (link.label) update.title = link.label
    if (link.url) update.url = link.url
    if (link.position !== undefined) update.order = link.position

    if (link.type === 'social' && 'platform' in link) {
        update.platform = link.platform
    }
    if (link.type === 'blog') {
        if ('description' in link) update.description = link.description
        if ('publishDate' in link) update.publish_date = link.publishDate
    }

    return update
}
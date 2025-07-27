import { supabase } from '../client'
import { Link, LinkType, TablesInsert, DatabaseLink, SocialLink, BlogLink, NormalLink, LinkUpdate } from '@/shared/index'


export const linkService = {
    getLinks: async (profileId: string): Promise<Link[]> => {
        const { data } = await supabase
            .from('links')
            .select('*')
            .eq('profile_id', profileId)
            .order('sort_order', { ascending: true })

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
        title: data.title,
        profileId: data.profile_id,
        label: data.title,
        url: data.url,
        type: data.type as LinkType,
        sortOrder: data.sort_order,
        isActive: data.is_active,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        platform: data.platform ?? undefined,
        description: data.description ?? undefined,
    };

    switch (data.type) {
        case 'social':
            return {
                ...base,
                title: data.title,
                type: 'social',
                platform: data.platform as SocialLink['platform'],
                isActive: data.is_active,
                createdAt: data.created_at,
                updatedAt: data.updated_at,
            }
        case 'blog':
            return {
                ...base,
                type: 'blog',
                title: data.title,
                description: data.description,
                isActive: data.is_active,
                createdAt: data.created_at,
                updatedAt: data.updated_at,
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
        title: link.title, // Use .title to match your app type
        url: link.url,
        type: link.type,
        sort_order: link.sortOrder,
        is_active: true,
        platform: null,
        cover: null,
        description: null,
    };

    switch (link.type) {
        case 'social':
            return {
                ...base,
                platform: (link as Omit<SocialLink, 'id' | 'createdAt'>).platform ?? null
            };
        case 'blog':
            return {
                ...base,
                description: (link as Omit<BlogLink, 'id' | 'createdAt'>).description ?? null,
            };
        default:
            return base;
    }
}

const convertToSupabaseLinkUpdate = (link: Partial<Link>): LinkUpdate => {
    const update: any = {};
    if (link.label) update.title = link.label;
    if (link.url) update.url = link.url;
    if (link.sortOrder !== undefined) update.sort_order = link.sortOrder; // <-- correct mapping
    if (link.type === 'social' && 'platform' in link) update.platform = link.platform;
    if (link.type === 'blog') {
        if ('description' in link) update.description = link.description;
    }
    return update;
};
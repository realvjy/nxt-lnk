import { supabase } from '../client'
import { Block, TablesInsert } from '../types'

export const blockService = {
    getBlocks: async (profileId: string): Promise<Block[]> => {
        const { data } = await supabase
            .from('blocks')
            .select('*')
            .eq('profile_id', profileId)
            .order('order', { ascending: true })

        return data?.map(convertToBlock) || []
    },

    createBlock: async (profileId: string, block: Omit<Block, 'id' | 'createdAt'>) => {
        const supabaseBlock = convertToSupabaseBlock(profileId, block)
        return await supabase
            .from('blocks')
            .insert(supabaseBlock)
            .select()
            .single()
    },

    updateBlock: async (id: string, block: Partial<Block>) => {
        const supabaseBlock = convertToSupabaseBlockUpdate(block)
        return await supabase
            .from('blocks')
            .update(supabaseBlock)
            .eq('id', id)
            .select()
            .single()
    },

    deleteBlock: async (id: string) => {
        return await supabase
            .from('blocks')
            .delete()
            .eq('id', id)
    },

    reorderBlocks: async (profileId: string, blockOrders: { id: string, order: number }[]) => {
        const updates = blockOrders.map(({ id, order }) => ({
            id,
            order,
            profile_id: profileId
        }))

        return await supabase
            .from('blocks')
            .upsert(updates)
    }
}

const convertToBlock = (data: any): Block => {
    return {
        id: data.id,
        type: data.type,
        content: data.content,
        order: data.order,
        settings: data.settings,
        createdAt: data.created_at
    }
}

const convertToSupabaseBlock = (profileId: string, block: Omit<Block, 'id' | 'createdAt'>): TablesInsert<'blocks'> => {
    return {
        profile_id: profileId,
        type: block.type,
        content: block.content,
        order: block.order,
        settings: block.settings
    }
}

const convertToSupabaseBlockUpdate = (block: Partial<Block>) => {
    const update: any = {}

    if (block.type) update.type = block.type
    if (block.content) update.content = block.content
    if (block.order !== undefined) update.order = block.order
    if (block.settings) update.settings = block.settings

    return update
}
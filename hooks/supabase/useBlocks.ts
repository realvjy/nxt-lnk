import { useEffect, useState } from 'react';
import { useSupabase } from '@/components/providers/SupabaseProvider';
import { Block, createBlock } from '@/shared/index';
import { useLayoutStore } from '@/lib/stores/layoutStore';

export const useBlocks = (userId: string) => {
    const { supabase } = useSupabase();
    const { layout, setLayout, reorderBlocks, addBlock, updateBlock, deleteBlock, duplicateBlock } = useLayoutStore();
    const [blocks, setBlocks] = useState<Block[]>(layout);

    useEffect(() => {
        const fetchBlocks = async () => {
            const { data: blocksData, error } = await supabase
                .from('blocks')
                .select('*')
                .eq('profile_id', userId)
                .order('sort_order', { ascending: true });

            if (error) {
                console.error('Error fetching blocks:', error);
            } else if (blocksData) {
                const formattedBlocks = blocksData.map(block => ({
                    id: block.id,
                    type: block.type,
                    props: block.content,
                    ...block.content,
                    settings: block.settings,
                }));
                setLayout(formattedBlocks);
            }
        };

        fetchBlocks();
    }, [supabase, userId, setLayout]);

    return {
        blocks,
        addBlock: (type: Block['type']) => {
            const newBlock = createBlock(type);
            addBlock(newBlock);
            setBlocks([...blocks, newBlock]);
        },
        updateBlock,
        deleteBlock,
        duplicateBlock,
        reorderBlocks,
    };
};
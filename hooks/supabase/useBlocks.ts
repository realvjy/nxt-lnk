import { useEffect, useState } from 'react';
import { useSupabase } from '@/components/providers/SupabaseProvider';
import { Block, createBlock } from '@/shared/index';
import { useLayoutStore } from '@/lib/stores/layoutStore';

export const useBlocks = (userId: string | undefined) => {
    const { supabase } = useSupabase();
    const { layout, setLayout } = useLayoutStore();
    const [blocks, setBlocks] = useState<Block[]>(layout);

    useEffect(() => {
        if (!userId) {
            console.error('User ID is undefined');
            return;
        }

        const fetchBlocks = async () => {
            try {
                const { data: blocksData, error } = await supabase
                    .from('blocks')
                    .select('*')
                    .eq('profile_id', userId)
                    .order('sort_order', { ascending: true });

                if (error) {
                    console.error('Error fetching blocks:', error);
                } else if (blocksData) {
                    setLayout(blocksData);
                }
            } catch (error) {
                console.error('Error fetching blocks:', error);
            }
        };

        fetchBlocks();
    }, [supabase, userId, setLayout]);

    const reorderBlocks = (fromIndex: number, toIndex: number) => {
        const updatedBlocks = [...blocks];
        const [movedBlock] = updatedBlocks.splice(fromIndex, 1);
        updatedBlocks.splice(toIndex, 0, movedBlock);
        setLayout(updatedBlocks);
    };

    return {
        blocks,
        addBlock: (type: Block['type']) => {
            const newBlock = createBlock(type);
            setLayout([...blocks, newBlock]);
        },
        updateBlock: (updatedBlock: Block) => {
            setLayout(blocks.map(block => block.id === updatedBlock.id ? updatedBlock : block));
        },
        deleteBlock: (blockId: string) => {
            setLayout(blocks.filter(block => block.id !== blockId));
        },
        duplicateBlock: (blockId: string) => {
            const blockToDuplicate = blocks.find(block => block.id === blockId);
            if (blockToDuplicate) {
                const newBlock = { ...blockToDuplicate, id: crypto.randomUUID() };
                setLayout([...blocks, newBlock]);
            }
        },
        reorderBlocks, // Ensure this is returned
    };
};
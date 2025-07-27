import { useEffect, useState } from 'react';
import { useSupabase } from '@/components/providers/SupabaseProvider';
import { Block, createBlock } from '@/shared/index';
import { useLayoutStore } from '@/lib/stores/layoutStore';
import { useBlocksStore } from '@/lib/stores/blocksStore';

export const useBlocks = (userId: string | undefined) => {
    const { supabase } = useSupabase();
    const {
        blocks,
        isLoading,
        error,
        setLoading,
        setError,
        addBlock,
        updateBlock,
        deleteBlock,
        reorderBlocks,
        setBlocks,
        clearBlocks,
        getBlockById,
    } = useBlocksStore();
    console.log('blocks', blocks);
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
                    setBlocks(blocksData);
                }
            } catch (error) {
                console.error('Error fetching blocks:', error);
            }
        };

        fetchBlocks();
    }, [userId, setBlocks, setLoading, setError]);

    // const reorderBlocks = (fromIndex: number, toIndex: number) => {
    //     const updatedBlocks = [...blocks];
    //     const [movedBlock] = updatedBlocks.splice(fromIndex, 1);
    //     updatedBlocks.splice(toIndex, 0, movedBlock);
    //     setLayout(updatedBlocks);
    // };
    return {
        blocks,
        isLoading,
        error
    };
};
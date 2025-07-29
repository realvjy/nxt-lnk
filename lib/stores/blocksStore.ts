import { create } from 'zustand'
import { Block, createBlock } from '@/types/app/blocks'
import { DatabaseBlock } from '@/types/supabase/tables'
import { mapBlockFromDb, mapBlockToDb } from '@/types/supabase/mappings'

interface BlocksState {
    blocks: Block[]
    isLoading: boolean
    error: string | null
}

interface BlocksActions {
    // Basic CRUD operations
    addBlock: (block: Omit<Block, 'id' | 'createdAt' | 'updatedAt'>) => void
    updateBlock: (id: string, updates: Partial<Block>) => void
    deleteBlock: (id: string) => void
    reorderBlocks: (fromIndex: number, toIndex: number) => void

    // Bulk operations
    setBlocks: (blocks: Block[]) => void
    clearBlocks: () => void

    // Utility functions
    getBlockById: (id: string) => Block | undefined
    getBlocksByType: (type: Block['type']) => Block[]

    // State management
    setLoading: (loading: boolean) => void
    setError: (error: string | null) => void
}

type BlocksStore = BlocksState & BlocksActions

export const useBlocksStore = create<BlocksStore>((set, get) => ({
    // Initial state
    blocks: [],
    isLoading: false,
    error: null,
    // Basic CRUD operations
    addBlock: (blockData) => {
        // Use the createBlock factory function for type safety
        const newBlock = createBlock(
            blockData.type,
            {
                ...blockData,
                profileId: blockData.profileId,
                sortOrder: get().blocks.length,
            }
        );

        // Add additional properties not handled by createBlock
        newBlock.profileId = blockData.profileId;
        newBlock.sortOrder = get().blocks.length;
        newBlock.createdAt = new Date().toISOString();
        newBlock.updatedAt = new Date().toISOString();

        set((state) => ({
            blocks: [...state.blocks, newBlock],
            error: null,
        }))
    },

    updateBlock: (id, updates) => {
        set((state) => ({
            blocks: state.blocks.map((block) =>
                block.id === id
                    ? { ...block, ...updates, updatedAt: new Date().toISOString() } as Block
                    : block
            ),
            error: null,
        }))
    },

    deleteBlock: (id) => {
        set((state) => ({
            blocks: state.blocks.filter((block) => block.id !== id),
            error: null,
        }))
    },

    reorderBlocks: (fromIndex, toIndex) => {
        set((state) => {
            const newBlocks = [...state.blocks];
            const [movedBlock] = newBlocks.splice(fromIndex, 1);
            newBlocks.splice(toIndex, 0, movedBlock);

            // Update sortOrder for all blocks
            return {
                blocks: newBlocks.map((block, index) => ({
                    ...block,
                    sortOrder: index,
                    updatedAt: new Date().toISOString(),
                })),
                error: null,
            };
        });
    },

    // Bulk operations
    setBlocks: (blocks) => {
        set({ blocks, error: null })
    },

    clearBlocks: () => {
        set({ blocks: [], error: null })
    },

    // Utility functions
    getBlockById: (id) => {
        return get().blocks.find((block) => block.id === id)
    },

    getBlocksByType: (type) => {
        return get().blocks.filter((block) => block.type === type)
    },

    // State management
    setLoading: (loading) => {
        set({ isLoading: loading })
    },

    setError: (error) => {
        set({ error })
    },
}))

// Helper function to convert database blocks to app blocks
export const loadBlocksFromDatabase = (dbBlocks: DatabaseBlock[]): Block[] => {
    return dbBlocks
        .map(block => mapBlockFromDb(block) as Block)
        .sort((a, b) => a.sortOrder - b.sortOrder)
}

import { create } from 'zustand'
import { Block, DatabaseBlock, mapBlockFromDb } from '@/lib/supabase/types'

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
    getBlocksByType: (type: string) => Block[]

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
        const newBlock: Block = {
            ...blockData,
            id: crypto.randomUUID(),
            sortOrder: get().blocks.length,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }

        set((state) => ({
            blocks: [...state.blocks, newBlock],
            error: null,
        }))
    },

    updateBlock: (id, updates) => {
        set((state) => ({
            blocks: state.blocks.map((block) =>
                block.id === id
                    ? { ...block, ...updates, updatedAt: new Date().toISOString() }
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
            const newBlocks = [...state.blocks]
            const [reorderedItem] = newBlocks.splice(fromIndex, 1)
            newBlocks.splice(toIndex, 0, reorderedItem)

            // Update sort orders
            const updatedBlocks = newBlocks.map((block, index) => ({
                ...block,
                sortOrder: index,
                updatedAt: new Date().toISOString(),
            }))

            return { blocks: updatedBlocks, error: null }
        })
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
        .map(mapBlockFromDb)
        .sort((a, b) => a.sortOrder - b.sortOrder)
}

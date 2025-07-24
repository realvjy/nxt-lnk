import { create } from 'zustand'
import { Block } from '@/shared/blocks'
import { arrayMove } from '@dnd-kit/sortable'

interface LayoutState {
    // Layout management
    layout: Block[]
    layoutHistory: Block[][]
    historyIndex: number

    // Actions
    setLayout: (layout: Block[]) => void
    addBlock: (block: Block) => void
    updateBlock: (updatedBlock: Block) => void
    deleteBlock: (blockId: string) => void
    duplicateBlock: (blockId: string, newBlock: Block) => void

    // History management
    addToHistory: () => void
    undo: () => void
    redo: () => void
    canUndo: () => boolean
    canRedo: () => boolean

    // Block operations
    moveBlock: (activeId: string, overId: string) => void
    reorderBlocks: (fromIndex: number, toIndex: number) => void

    // Storage integration
    loadLayout: (username: string) => void
    saveLayout: (username: string) => void
    clearLayout: () => void
}

export const useLayoutStore = create<LayoutState>((set, get) => ({
    layout: [],
    layoutHistory: [],
    historyIndex: -1,

    setLayout: (layout) => {
        set({ layout })
        get().addToHistory()
    },

    addBlock: (block) => {
        set((state) => ({
            layout: [...state.layout, block]
        }))
        get().addToHistory()
    },

    updateBlock: (updatedBlock) => {
        set((state) => ({
            layout: state.layout.map(block =>
                block.id === updatedBlock.id ? updatedBlock : block
            )
        }))
        get().addToHistory()
    },

    deleteBlock: (blockId) => {
        set((state) => ({
            layout: state.layout.filter(block => block.id !== blockId)
        }))
        get().addToHistory()
    },

    duplicateBlock: (blockId, newBlock) => {
        set((state) => {
            const blockIndex = state.layout.findIndex(b => b.id === blockId)
            if (blockIndex === -1) return state

            const newLayout = [...state.layout]
            newLayout.splice(blockIndex + 1, 0, newBlock)
            return { layout: newLayout }
        })
        get().addToHistory()
    },

    addToHistory: () => {
        set((state) => {
            const newHistory = state.layoutHistory.slice(0, state.historyIndex + 1)
            newHistory.push([...state.layout])
            return {
                layoutHistory: newHistory.slice(-50), // Keep last 50 states
                historyIndex: Math.min(newHistory.length - 1, 49)
            }
        })
    },

    undo: () => {
        const state = get()
        if (state.canUndo()) {
            const newIndex = state.historyIndex - 1
            set({
                layout: [...state.layoutHistory[newIndex]],
                historyIndex: newIndex
            })
        }
    },

    redo: () => {
        const state = get()
        if (state.canRedo()) {
            const newIndex = state.historyIndex + 1
            set({
                layout: [...state.layoutHistory[newIndex]],
                historyIndex: newIndex
            })
        }
    },

    canUndo: () => {
        const state = get()
        return state.historyIndex > 0
    },

    canRedo: () => {
        const state = get()
        return state.historyIndex < state.layoutHistory.length - 1
    },

    moveBlock: (activeId, overId) => {
        set((state) => {
            const oldIndex = state.layout.findIndex((b) => b.id === activeId)
            const newIndex = state.layout.findIndex((b) => b.id === overId)

            if (oldIndex !== -1 && newIndex !== -1) {
                const newLayout = arrayMove(state.layout, oldIndex, newIndex)
                return { layout: newLayout }
            }
            return state
        })
        // Add to history after move (debounced)
        setTimeout(() => get().addToHistory(), 100)
    },

    reorderBlocks: (fromIndex, toIndex) => {
        set((state) => {
            const newLayout = arrayMove(state.layout, fromIndex, toIndex)
            return { layout: newLayout }
        })
        get().addToHistory()
    },

    loadLayout: (username) => {
        if (typeof window === 'undefined' || !username) return

        const saved = localStorage.getItem(`user:${username}:layout`)
        if (!saved) {
            set({ layout: [], layoutHistory: [], historyIndex: -1 })
            return
        }

        try {
            const layout = JSON.parse(saved)
            set({
                layout,
                layoutHistory: [layout],
                historyIndex: 0
            })
        } catch (e) {
            console.warn('Failed to parse saved layout:', e)
            set({ layout: [], layoutHistory: [], historyIndex: -1 })
        }
    },

    saveLayout: (username) => {
        if (typeof window === 'undefined' || !username) return

        const { layout } = get()
        localStorage.setItem(`user:${username}:layout`, JSON.stringify(layout))
    },

    clearLayout: () => {
        set({
            layout: [],
            layoutHistory: [],
            historyIndex: -1
        })
    }
}))
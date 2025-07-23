// layoutStore.ts
import { create } from 'zustand'
import { Block } from '@/shared/blocks'
import { useUserStore } from './userStore'
import { arrayMove } from '@dnd-kit/sortable'

type LayoutState = {
    layout: Block[]
    setLayout: (layout: Block[]) => void
    updateBlock: (id: string, newBlock: Block) => void
    addBlock: (block: Block) => void
    moveBlock: (activeId: string, overId: string) => void
    getStoredLayout: (username: string) => Block[]
}

// Helper function for localStorage
const getStoredLayout = (username: string) => {
    if (typeof window === 'undefined' || !username) return []

    const saved = localStorage.getItem(`user:${username}`)
    if (!saved) return []

    try {
        return JSON.parse(saved)
    } catch (e) {
        console.warn('Failed to parse saved layout:', e)
        return []
    }
}

export const useLayoutStore = create<LayoutState>((set, get) => ({
    layout: [],

    setLayout: (layout) => set({ layout }),

    updateBlock: (id, newBlock) =>
        set((state) => ({
            layout: state.layout.map((block) =>
                block.id === id ? newBlock : block
            ),
        })),

    addBlock: (block) =>
        set((state) => ({
            layout: [...state.layout, block],
        })),

    moveBlock: (activeId, overId) =>
        set((state) => {
            const oldIndex = state.layout.findIndex((b) => b.id === activeId)
            const newIndex = state.layout.findIndex((b) => b.id === overId)

            if (oldIndex !== -1 && newIndex !== -1) {
                return {
                    layout: arrayMove(state.layout, oldIndex, newIndex)
                }
            }
            return state
        }),

    getStoredLayout: (username) => {
        const layout = getStoredLayout(username)
        if (layout.length > 0) {
            set({ layout })
        }
        return layout
    }
}))
// useBuilderStore.ts
import { create } from 'zustand'
import { Block } from '@/shared/blocks'

type State = {
    layout: Block[]
    username: string
    setUsername: (u: string) => void
    setLayout: (layout: Block[]) => void
    updateBlock: (id: string, newBlock: Block) => void
    addBlock: (block: Block) => void
}

export const useBuilderStore = create<State>((set) => ({
    layout: [],
    username: '',
    setUsername: (username) => set({ username }),
    setLayout: (layout) => set({ layout }),
    updateBlock: (id, newBlock) =>
        set((state) => {
            const layout = [...state.layout]
            layout[id] = newBlock
            return { layout }
        }),
    addBlock: (block) =>
        set((state) => ({
            layout: [...state.layout, block],
        })),
}))

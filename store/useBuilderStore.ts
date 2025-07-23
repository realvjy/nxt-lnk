// store/useBuilderStore.ts
import { create } from 'zustand'
import type { Block } from '@shared/blocks'

interface BuilderState {
    layout: Block[]
    username: string
    setLayout: (blocks: Block[]) => void
    setUsername: (name: string) => void
    addBlock: (block: Block) => void
    updateBlock: (index: number, newBlock: Block) => void
}

export const useBuilderStore = create<BuilderState>((set, get) => ({
    layout: [],
    username: 'realvjy',
    setLayout: (blocks) => set({ layout: blocks }),
    setUsername: (name) => set({ username: name }),
    addBlock: (block) => set({ layout: [...get().layout, block] }),
    updateBlock: (index, newBlock) => {
        const layout = [...get().layout]
        layout[index] = newBlock
        set({ layout })
    },
}))
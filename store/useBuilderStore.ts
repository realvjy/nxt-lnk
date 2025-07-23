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
    loadFromStorage: () => void
    saveToStorage: () => void
}

// Helper functions for localStorage
const getStoredUsername = () => {
    if (typeof window === 'undefined') return ''
    return localStorage.getItem('active:username') || ''
}

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

export const useBuilderStore = create<State>((set, get) => ({
    layout: [],
    username: '',

    setUsername: (username) => {
        set({ username })
        // When username changes, try to load layout for that user
        const state = get()
        if (username) {
            localStorage.setItem('active:username', username)
            const layout = getStoredLayout(username)
            if (layout.length > 0) {
                set({ layout })
            }
        }
    },

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

    loadFromStorage: () => {
        const username = getStoredUsername()
        if (username) {
            set({ username })
            const layout = getStoredLayout(username)
            if (layout.length > 0) {
                set({ layout })
            }
        }
    },

    saveToStorage: () => {
        const { username, layout } = get()
        if (!username) return
        localStorage.setItem(`user:${username}`, JSON.stringify(layout))
        localStorage.setItem('active:username', username)
    }
}))

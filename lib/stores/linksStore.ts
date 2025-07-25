import { create } from 'zustand'
import { Link, DatabaseLink, mapLinkFromDb } from '@/lib/supabase/types'

interface LinksState {
    links: Link[]
    isLoading: boolean
    error: string | null
}

interface LinksActions {
    // Basic CRUD operations
    addLink: (link: Omit<Link, 'id' | 'sortOrder' | 'createdAt' | 'updatedAt'>) => void
    updateLink: (id: string, updates: Partial<Link>) => void
    deleteLink: (id: string) => void
    reorderLinks: (fromIndex: number, toIndex: number) => void

    // Bulk operations
    setLinks: (links: Link[]) => void
    clearLinks: () => void

    // Utility functions
    getLinkById: (id: string) => Link | undefined
    getLinksByType: (type: Link['type']) => Link[]
    getActiveLinksByType: (type: Link['type']) => Link[]

    // State management
    setLoading: (loading: boolean) => void
    setError: (error: string | null) => void
}

type LinksStore = LinksState & LinksActions

export const useLinksStore = create<LinksStore>((set, get) => ({
    // Initial state
    links: [],
    isLoading: false,
    error: null,

    // Basic CRUD operations
    addLink: (linkData) => {
        const newLink = {
            ...linkData,
            id: crypto.randomUUID(),
            sortOrder: get().links.length,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        } as Link

        set((state) => ({
            links: [...state.links, newLink],
            error: null,
        }))
    },

    updateLink: (id, updates) => {
        set((state) => ({
            links: state.links.map((link) =>
                link.id === id
                    ? ({ ...link, ...updates, updatedAt: new Date().toISOString() } as Link)
                    : link
            ),
            error: null,
        }))
    },

    deleteLink: (id) => {
        set((state) => ({
            links: state.links.filter((link) => link.id !== id),
            error: null,
        }))
    },

    reorderLinks: (fromIndex, toIndex) => {
        set((state) => {
            const newLinks = [...state.links]
            const [reorderedItem] = newLinks.splice(fromIndex, 1)
            newLinks.splice(toIndex, 0, reorderedItem)

            // Update sort orders
            const updatedLinks = newLinks.map((link, index) => ({
                ...link,
                sortOrder: index,
                updatedAt: new Date().toISOString(),
            } as Link))

            return { links: updatedLinks, error: null }
        })
    },

    // Bulk operations
    setLinks: (links) => {
        set({ links, error: null })
    },

    clearLinks: () => {
        set({ links: [], error: null })
    },

    // Utility functions
    getLinkById: (id) => {
        return get().links.find((link) => link.id === id)
    },

    getLinksByType: (type) => {
        return get().links.filter((link) => link.type === type)
    },

    getActiveLinksByType: (type) => {
        return get().links.filter((link) => link.type === type && link.isActive)
    },

    // State management
    setLoading: (loading) => {
        set({ isLoading: loading })
    },

    setError: (error) => {
        set({ error })
    },
}))

// Helper function to convert database links to app links
export const loadLinksFromDatabase = (dbLinks: DatabaseLink[]): Link[] => {
    return dbLinks
        .map(mapLinkFromDb)
        .sort((a, b) => a.sortOrder - b.sortOrder)
}

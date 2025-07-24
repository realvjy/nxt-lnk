// lib/stores/builderStore.ts - Enhanced Builder Store
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface BuilderState {
    // UI State
    isEditing: boolean
    isDragging: boolean
    showGrid: boolean
    sidebarCollapsed: boolean
    selectedBlockId: string | null

    // Preview state
    previewMode: 'desktop' | 'tablet' | 'mobile'

    // Actions
    setEditing: (isEditing: boolean) => void
    setDragging: (isDragging: boolean) => void
    setShowGrid: (showGrid: boolean) => void
    setSidebarCollapsed: (collapsed: boolean) => void
    setPreviewMode: (mode: 'desktop' | 'tablet' | 'mobile') => void
    setSelectedBlockId: (id: string | null) => void

    // Builder actions
    toggleEditMode: () => void
    toggleSidebar: () => void
    resetBuilder: () => void

    // Save/Load state
    isSaving: boolean
    lastSaved: Date | null
    setSaving: (saving: boolean) => void
    setLastSaved: (date: Date) => void
}

export const useBuilderStore = create<BuilderState>()(
    persist(
        (set, get) => ({
            isEditing: true,
            isDragging: false,
            showGrid: false,
            sidebarCollapsed: false,
            selectedBlockId: null,
            previewMode: 'desktop',
            isSaving: false,
            lastSaved: null,

            setEditing: (isEditing) => set({ isEditing }),
            setDragging: (isDragging) => set({ isDragging }),
            setShowGrid: (showGrid) => set({ showGrid }),
            setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
            setPreviewMode: (mode) => set({ previewMode: mode }),
            setSelectedBlockId: (id) => set({ selectedBlockId: id }),
            setSaving: (saving) => set({ isSaving: saving }),
            setLastSaved: (date) => set({ lastSaved: date }),

            toggleEditMode: () => set((state) => ({
                isEditing: !state.isEditing,
                selectedBlockId: state.isEditing ? null : state.selectedBlockId
            })),

            toggleSidebar: () => set((state) => ({
                sidebarCollapsed: !state.sidebarCollapsed
            })),

            resetBuilder: () => set({
                isEditing: true,
                isDragging: false,
                showGrid: false,
                selectedBlockId: null,
                previewMode: 'desktop',
                isSaving: false
            }),
        }),
        {
            name: 'builder-preferences',
            partialize: (state) => ({
                sidebarCollapsed: state.sidebarCollapsed,
                previewMode: state.previewMode,
                showGrid: state.showGrid
            })
        }
    )
)
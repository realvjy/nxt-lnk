// lib/stores/index.ts - Simplified Store Exports

import { useBuilderStore } from './builderStore'
import { useLayoutStore } from './layoutStore'
import { usePersistenceStore } from './persistenceStore'
import { useUserStore } from './userStore'

// Core stores - these are the main ones you need
export { useUserStore } from './userStore'
export { useLayoutStore } from './layoutStore'
export { useBuilderStore } from './builderStore'
export { usePersistenceStore, useTrackChanges } from './persistenceStore'

// Legacy stores (if you still need them)
// export { useCardStore } from './useCardStore' // Remove if not needed

// Removed useBlockStore - functionality moved to useLayoutStore

// App initialization hook
export function useAppInitialization() {
    const { loadFromStorage } = usePersistenceStore()
    const { initializeUser } = useUserStore()
    const { resetBuilder } = useBuilderStore()

    const initializeApp = async (username?: string) => {
        try {
            // Reset builder to default state
            resetBuilder()

            // Initialize user
            initializeUser()

            // Load data if username provided
            if (username) {
                await loadFromStorage(username)
            }

            console.log('App initialized successfully')
        } catch (error) {
            console.error('Failed to initialize app:', error)
        }
    }

    return { initializeApp }
}

// Unified block operations hook - integrates all stores
export function useBlockOperations() {
    const {
        addBlock,
        updateBlock,
        deleteBlock,
        duplicateBlock,
        layout
    } = useLayoutStore()

    const {
        setSelectedBlockId,
        selectedBlockId
    } = useBuilderStore()

    const { setUnsavedChanges } = usePersistenceStore()

    // Enhanced operations that coordinate between stores
    const handleAddBlock = (block: any) => {
        addBlock(block)
        setSelectedBlockId(block.id)
        setUnsavedChanges(true)
    }

    const handleUpdateBlock = (updatedBlock: any) => {
        updateBlock(updatedBlock)
        setUnsavedChanges(true)
    }

    const handleDeleteBlock = (blockId: string) => {
        deleteBlock(blockId)
        if (selectedBlockId === blockId) {
            setSelectedBlockId(null)
        }
        setUnsavedChanges(true)
    }

    const handleDuplicateBlock = (blockId: string, newBlock: any) => {
        duplicateBlock(blockId, newBlock)
        setSelectedBlockId(newBlock.id)
        setUnsavedChanges(true)
    }

    const handleSelectBlock = (blockId: string | null) => {
        setSelectedBlockId(blockId)
    }

    return {
        // Operations
        addBlock: handleAddBlock,
        updateBlock: handleUpdateBlock,
        deleteBlock: handleDeleteBlock,
        duplicateBlock: handleDuplicateBlock,
        selectBlock: handleSelectBlock,

        // State
        blocks: layout,
        selectedBlockId,

        // Helpers
        getBlockById: (id: string) => layout.find(block => block.id === id),
        getBlocksByType: (type: string) => layout.filter(block => block.type === type),
        hasBlocks: layout.length > 0
    }
}

// History operations hook
export function useHistoryOperations() {
    const { undo, redo, canUndo, canRedo } = useLayoutStore()

    return {
        undo,
        redo,
        canUndo: canUndo(),
        canRedo: canRedo()
    }
}

// Save operations hook
export function useSaveOperations() {
    const { saveToStorage, isLoading, hasUnsavedChanges, enableAutoSave, disableAutoSave } = usePersistenceStore()
    const { username } = useUserStore()
    const { setLastSaved, setSaving } = useBuilderStore()

    const handleSave = async () => {
        if (!username) {
            throw new Error('No username available for saving')
        }

        setSaving(true)
        try {
            await saveToStorage()
            setLastSaved(new Date())
        } finally {
            setSaving(false)
        }
    }

    return {
        saveProfile: handleSave,
        isLoading,
        hasUnsavedChanges,
        enableAutoSave,
        disableAutoSave
    }
}

// Preview operations hook  
export function usePreviewOperations() {
    const {
        isEditing,
        previewMode,
        setEditing,
        setPreviewMode,
        toggleEditMode
    } = useBuilderStore()

    return {
        isEditing,
        previewMode,
        setEditing,
        setPreviewMode,
        toggleEditMode,

        // Helper methods
        enterEditMode: () => setEditing(true),
        enterPreviewMode: () => setEditing(false),
        toggleMode: toggleEditMode
    }
}

// Complete profile hook - combines user and layout data
export function useCompleteProfile() {
    const { username, profile } = useUserStore()
    const { layout } = useLayoutStore()
    const { isProfileComplete } = useUserStore()

    return {
        username,
        profile,
        blocks: layout,
        isComplete: isProfileComplete(),

        // Computed properties
        displayName: profile.fullName || username || 'User',
        hasContent: layout.length > 0 || profile.fullName || profile.bio,

        // Profile URL
        profileUrl: username ? `/${username}` : null
    }
}
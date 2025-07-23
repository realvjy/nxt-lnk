// store/index.ts
// Export all stores for convenient imports

import { usePersistenceStore } from './persistenceStore'

export { useUserStore } from './userStore'
export { useLayoutStore } from './layoutStore'
export { usePersistenceStore } from './persistenceStore'

// Helper function to initialize all stores
export function initializeStores() {
    // Load data from localStorage into stores
    usePersistenceStore.getState().loadFromStorage()
}

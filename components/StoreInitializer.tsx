'use client'

import { useEffect } from 'react'
import { initializeStores } from '@/lib/stores/index'

export default function StoreInitializer() {
    useEffect(() => {
        // Initialize all stores on client-side
        initializeStores()
    }, [])

    // This component doesn't render anything
    return null
}

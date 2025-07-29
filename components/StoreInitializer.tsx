'use client'
import { useEffect } from 'react'
import { initializeStores } from '@/lib/stores/index'
import { useInitProfile } from '@/hooks/useInitProfile'

export default function StoreInitializer() {
    useEffect(() => {
        initializeStores()
    }, [])
    useInitProfile()
    return null
}

// app/[username]/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import BlockRenderer from '@components/editor/BlockRenderer'

export default function UserPage() {
    const { username } = useParams()
    const [layout, setLayout] = useState([])

    useEffect(() => {
        if (!username) return
        const raw = localStorage.getItem(`user:${username}`)
        if (raw) setLayout(JSON.parse(raw))
    }, [username])

    if (!layout.length) {
        return <div className="p-6 text-gray-500">No content for "{username}"</div>
    }

    return (
        <main className="max-w-xl mx-auto p-6 space-y-6">
            <BlockRenderer layout={layout} />
        </main>
    )
}

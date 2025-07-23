// app/[username]/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import BlockRenderer from '@/components/editor/BlockRenderer'
import { ProfileCard } from '@/components/ProfileCard'
import { LinkCard } from '@/components/LinkCard'

export default function UserPage() {
    const { username } = useParams()
    const [layout, setLayout] = useState([])

    useEffect(() => {
        if (!username || typeof username !== 'string') return

        const saved = localStorage.getItem(`user:${username}`)
        if (saved) {
            try {
                setLayout(JSON.parse(saved))
            } catch (err) {
                console.error('Failed to parse layout:', err)
            }
        }
    }, [username])



    if (!layout.length) {
        return <div className="p-6 text-gray-500">No content for "{username}"</div>
    }

    return (
        <main className="max-w-md mx-auto p-6 space-y-6">


            <div className="space-y-3">
                {layout.map((block, i) => (
                    <BlockRenderer block={block} isEdit={false} />
                ))}

            </div>
        </main>
    )
}

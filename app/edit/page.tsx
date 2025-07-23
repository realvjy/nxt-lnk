// app/edit/page.tsx

'use client'
import { useBuilderStore } from '@store/useBuilderStore'
import BlockRenderer from '@components/editor/BlockRenderer'
import SlashMenu from '@components/editor/SlashMenu'
import { Button } from '@ui/button'
import { useEffect } from 'react'
import { Input } from '@components/ui/input'


function SaveButton() {
    const layout = useBuilderStore((s) => s.layout)
    const username = useBuilderStore((s) => s.username)

    const handleSave = () => {
        localStorage.setItem(`user:${username}`, JSON.stringify(layout))
        alert(`Saved! Go to /${username}`)
    }

    return (

        <Button
            onClick={handleSave}
        >
            💾 Save
        </Button>
    )
}

function UsernameInput() {
    const username = useBuilderStore((s) => s.username)
    const setUsername = useBuilderStore((s) => s.setUsername)

    return (
        <Input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
        />
    )
}

export default function EditPage() {
    const username = useBuilderStore((s) => s.username)
    const setLayout = useBuilderStore((s) => s.setLayout)

    useEffect(() => {
        const saved = localStorage.getItem(`user:${username}`)
        if (saved) {
            try {
                setLayout(JSON.parse(saved))
            } catch (e) {
                console.warn('Failed to parse saved layout:', e)
            }
        }
    }, [username, setLayout])

    return (
        <main className="max-w-xl mx-auto p-6 space-y-6">
            <h1 className="text-xl font-semibold">Edit Your Page</h1>
            <UsernameInput />
            <BlockRenderer />
            <SlashMenu />
            <SaveButton />
        </main>
    )
}
'use client'

import { useEffect, useState } from 'react'
import { useBuilderStore } from '@/store/useBuilderStore'
import BlockRenderer from '@/components/editor/BlockRenderer'
import SlashMenu from '@/components/editor/SlashMenu'
import { Button } from '@/ui/button'
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core'
import {
    SortableContext,
    verticalListSortingStrategy,
    arrayMove,
} from '@dnd-kit/sortable'
import SortableBlock from '@/components/editor/SortableBlock'
function SaveButton() {
    const layout = useBuilderStore((s) => s.layout)
    const username = useBuilderStore((s) => s.username)

    const handleSave = () => {
        if (!username) return alert("Username is required")
        localStorage.setItem(`user:${username}`, JSON.stringify(layout))
        localStorage.setItem('active:username', username)
        alert(`Saved! Go to /${username}`)
    }

    return <Button onClick={handleSave}>💾 Save</Button>
}

function UsernameInput() {
    const username = useBuilderStore((s) => s.username)
    const setUsername = useBuilderStore((s) => s.setUsername)

    useEffect(() => {
        const savedUsername = localStorage.getItem('active:username')
        if (savedUsername) setUsername(savedUsername)
    }, [setUsername])

    return (
        <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            className="w-full border border-gray-300 px-3 py-2 rounded"
        />
    )
}

export default function EditPage() {
    const username = useBuilderStore((s) => s.username)
    const layout = useBuilderStore((s) => s.layout)
    const setLayout = useBuilderStore((s) => s.setLayout)
    const sensors = useSensors(useSensor(PointerSensor))

    const [hasHydrated, setHasHydrated] = useState(false)
    const handleDragEnd = (event: any) => {
        const { active, over } = event
        if (!over || active.id === over.id) return

        const oldIndex = layout.findIndex((b) => b.id === active.id)
        const newIndex = layout.findIndex((b) => b.id === over.id)

        if (oldIndex !== -1 && newIndex !== -1) {
            setLayout(arrayMove(layout, oldIndex, newIndex))
        }
    }

    // Hydrate username from localStorage once
    useEffect(() => {
        const savedUsername = localStorage.getItem('active:username')
        if (savedUsername) {
            useBuilderStore.getState().setUsername(savedUsername)
        }
        setHasHydrated(true)
    }, [])

    // Then load layout only when hydrated and username is ready
    useEffect(() => {
        if (!hasHydrated || !username) return

        const saved = localStorage.getItem(`user:${username}`)
        if (saved) {
            try {
                setLayout(JSON.parse(saved))
            } catch (e) {
                console.warn('Failed to parse saved layout:', e)
            }
        }
    }, [hasHydrated, username, setLayout])

    return (
        <main className="max-w-xl mx-auto p-6 space-y-6">
            <h1 className="text-xl font-semibold">Edit Your Page</h1>
            <UsernameInput />

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext
                    items={layout.map((block) => block.id)}
                    strategy={verticalListSortingStrategy}
                >
                    {layout.map((block) => (
                        <SortableBlock key={block.id} id={block.id}>
                            <BlockRenderer block={block} isEdit />
                        </SortableBlock>
                    ))}
                </SortableContext>


            </DndContext>

            <SlashMenu />
            <SaveButton />
        </main>
    )
}

'use client'

import { useEffect, useState } from 'react'
import { useUserStore, useLayoutStore, initializeStores, usePersistenceStore } from '@/store/index';
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
    const layout = useLayoutStore((s) => s.layout)
    const username = useUserStore((s) => s.username)
    const saveToStorage = usePersistenceStore((s) => s.saveToStorage)

    const handleSave = () => {
        if (!username) return alert("Username is required")
        saveToStorage()
        alert(`Saved! Go to /${username}`)
    }

    return <Button onClick={handleSave}> Save</Button>
}

function PreviewButton() {
    const username = useUserStore((s) => s.username)

    const handlePreview = () => {
        if (!username) {
            alert("Username is required to preview")
            return
        }

        // Save current state before opening preview
        usePersistenceStore.getState().saveToStorage()

        // Open the preview URL in a new tab
        window.open(`/${username}`, '_blank')
    }

    return (
        <Button
            onClick={handlePreview}
            variant="outline"
            className="ml-2 bg-blue-500 text-white hover:bg-blue-600"
        >
            Preview
        </Button>
    )
}

function UsernameInput() {
    const username = useUserStore((s) => s.username)
    const setUsername = useUserStore((s) => s.setUsername)

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
    const username = useUserStore((s) => s.username)
    const layout = useLayoutStore((s) => s.layout)
    const setLayout = useLayoutStore((s) => s.setLayout)
    const loadFromStorage = usePersistenceStore((s) => s.loadFromStorage)
    const saveToStorage = usePersistenceStore((s) => s.saveToStorage)
    const sensors = useSensors(useSensor(PointerSensor))

    const [isLoading, setIsLoading] = useState(true)
    const handleDragEnd = (event: any) => {
        const { active, over } = event
        if (!over || active.id === over.id) return

        const oldIndex = layout.findIndex((b) => b.id === active.id)
        const newIndex = layout.findIndex((b) => b.id === over.id)

        if (oldIndex !== -1 && newIndex !== -1) {
            setLayout(arrayMove(layout, oldIndex, newIndex))
        }
    }

    useEffect(() => {
        loadFromStorage()
        setIsLoading(false)
    }, [loadFromStorage])

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
            <div className="flex">
                <SaveButton />
                <PreviewButton />
            </div>
        </main>
    )
}

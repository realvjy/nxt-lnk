// components/settings/SettingsPanel.tsx
"use client"

import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core"
import {
    arrayMove,
    SortableContext,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { useState } from "react"
import { DraggableSetting } from "./DraggableSetting"
import { UsernameSetting } from "./UsernameSetting"

const initialSettings = [
    { id: "darkMode", name: "Dark Mode", enabled: true },
    { id: "notifications", name: "Notifications", enabled: false },
    { id: "betaAccess", name: "Beta Access", enabled: true },
]

export default function SettingsPanel() {
    const [items, setItems] = useState(initialSettings)

    const sensors = useSensors(useSensor(PointerSensor))

    const handleDragEnd = (event: any) => {
        const { active, over } = event
        if (active.id !== over?.id) {
            const oldIndex = items.findIndex(i => i.id === active.id)
            const newIndex = items.findIndex(i => i.id === over?.id)
            setItems(arrayMove(items, oldIndex, newIndex))
        }
    }

    return (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-2">
                    {items.map(setting => (
                        <DraggableSetting
                            key={setting.id}
                            id={setting.id}
                            name={setting.name}
                            enabled={setting.enabled}
                            onToggle={(value) =>
                                setItems(prev =>
                                    prev.map(s => s.id === setting.id ? { ...s, enabled: value } : s)
                                )
                            }
                        />

                    ))}
                    <UsernameSetting /> {/* 👈 Add this */}

                </div>
            </SortableContext>
        </DndContext>
    )
}

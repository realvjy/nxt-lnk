// components/settings/DraggableSetting.tsx
"use client"

import { Card } from '@/components/ui/card'
import { Switch } from "@/components/ui/switch"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { cn } from "@/lib/utils"

type Props = {
    id: string
    name: string
    enabled: boolean
    onToggle: (value: boolean) => void
}

export function DraggableSetting({ id, name, enabled, onToggle }: Props) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    return (
        <Card
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            style={style}
            className={cn("flex items-center justify-between p-4 cursor-move")}
        >
            <span>{name}</span>
            <Switch checked={enabled} onCheckedChange={onToggle} />
        </Card>
    )
}

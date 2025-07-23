'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { ReactNode } from 'react'
import { GripVertical } from 'lucide-react' // Optional drag icon

export default function SortableBlock({ id, children }: { id: string; children: ReactNode }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="relative"
        >
            {/* Drag handle */}
            <div
                {...attributes}
                {...listeners}
                className="absolute -left-6 top-2 cursor-grab select-none text-gray-400"
            >
                <GripVertical size={18} />
            </div>

            {/* Editable block content */}
            {children}
        </div>
    )
}

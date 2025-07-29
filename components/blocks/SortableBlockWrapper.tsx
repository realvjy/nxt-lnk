import React from 'react';
import {
    useSortable,
    SortableContext,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils/utils';
import type { Block } from '@/types/app/blocks';

interface SortableBlockWrapperProps {
    block: Block;
    isEditing: boolean;
    isSelected: boolean;
    isDragging?: boolean;
    children: React.ReactNode;
    onSelect: (id: string) => void;
    onUpdate: (block: Block) => void;
    onDelete: (blockId: string) => void; // Add the onDelete prop
    onDuplicate: (blockId: string) => void; // Add the onDuplicate prop
    onAddBlock: (type: Block['type']) => void; // Add the onAddBlock prop
}

export const SortableBlockWrapper: React.FC<SortableBlockWrapperProps> = ({
    block,
    isEditing,
    isSelected,
    isDragging = false,
    children,
    onSelect,
    onUpdate,
    onDelete, // Destructure the onDelete prop
    onDuplicate, // Destructure the onDuplicate prop
    onAddBlock, // Destructure the onAddBlock prop
}) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging: isSortableDragging,
    } = useSortable({
        id: block.id,
        disabled: !isEditing,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const handleClick = (e: React.MouseEvent) => {
        if (!isEditing) return;
        e.stopPropagation();
        onSelect(block.id);
    };

    // Example usage of onDelete
    const handleDelete = () => {
        onDelete(block.id);
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                "group relative transition-all duration-200",
                {
                    "opacity-50": isSortableDragging,
                    "cursor-move": isEditing,
                    "hover:shadow-md": isEditing && !isSortableDragging,
                    "ring-2 ring-primary ring-offset-2": isSelected && isEditing,
                }
            )}
            onClick={handleClick}
            {...attributes}
        >
            {/* Drag Handle - Only visible in edit mode */}
            {isEditing && (
                <div
                    className={cn(
                        "absolute -left-8 top-1/2 transform -translate-y-1/2 z-10",
                        "opacity-0 group-hover:opacity-100 transition-opacity duration-200",
                        "cursor-grab active:cursor-grabbing",
                        "p-1 bg-background border rounded shadow-sm",
                        {
                            "opacity-100": isSelected,
                        }
                    )}
                    {...listeners}
                >
                    <GripVertical className="w-4 h-4 text-muted-foreground" />
                </div>
            )}

            {/* Block Content */}
            <div
                className={cn(
                    "transition-all duration-200",
                    {
                        "transform scale-105": isSelected && isEditing,
                        "pointer-events-none": isSortableDragging,
                    }
                )}
            >
                {children}
            </div>

            {/* Selection Indicator */}
            {isSelected && isEditing && (
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-0 bg-primary/5 rounded-lg" />
                    <div className="absolute top-2 right-2">
                        <div className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full font-medium">
                            Selected
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
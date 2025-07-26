import React from 'react';
import {
    DndContext,
    DragEndEvent,
    DragStartEvent,
    DragOverEvent,
    DragOverlay,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    defaultDropAnimationSideEffects,
    DropAnimation,
} from '@dnd-kit/core';
import {
    SortableContext,
    verticalListSortingStrategy,
    arrayMove,
} from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { useLayoutStore } from '@/lib/stores/layoutStore';
import { useBuilderStore } from '@/lib/stores/builderStore';
import { BlockRenderer } from './BlockRenderer';
import type { Block } from '@/shared/app/blocks';

const dropAnimationConfig: DropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
        styles: {
            active: {
                opacity: '0.4',
            },
        },
    }),
};

interface DragDropProviderProps {
    children: React.ReactNode;
    disabled?: boolean;
}

export const DragDropProvider: React.FC<DragDropProviderProps> = ({
    children,
    disabled = false
}) => {
    const { layout, reorderBlocks } = useLayoutStore();
    const { setDragging, isDragging } = useBuilderStore();
    const [activeBlock, setActiveBlock] = React.useState<Block | null>(null);

    // Configure sensors for different input methods
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8, // 8px movement required to start drag
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: (event, { context: { active, droppableRects, droppableContainers } }) => {
                // Custom keyboard navigation logic can go here
                return { x: 0, y: 0 };
            },
        })
    );

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        const activeBlockData = layout.find(block => block.id === active.id);

        if (activeBlockData) {
            setActiveBlock(activeBlockData);
            setDragging(true);
        }
    };

    const handleDragOver = (event: DragOverEvent) => {
        // Optional: Add visual feedback during drag over
        // console.log('Drag over:', event);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        setActiveBlock(null);
        setDragging(false);

        if (!over || active.id === over.id) {
            return;
        }

        const oldIndex = layout.findIndex(block => block.id === active.id);
        const newIndex = layout.findIndex(block => block.id === over.id);

        if (oldIndex !== -1 && newIndex !== -1) {
            reorderBlocks(oldIndex, newIndex);
        }
    };

    const handleDragCancel = () => {
        setActiveBlock(null);
        setDragging(false);
    };

    if (disabled) {
        return <>{children}</>;
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
            modifiers={[restrictToVerticalAxis]}
        >
            <SortableContext
                items={layout.map(block => block.id)}
                strategy={verticalListSortingStrategy}
            >
                {children}
            </SortableContext>

            <DragOverlay dropAnimation={dropAnimationConfig}>
                {activeBlock ? (
                    <div className="transform rotate-3 shadow-2xl">
                        <BlockRenderer
                            block={activeBlock}
                            isEditing={false}
                            isSelected={false}
                            isDragging={true}
                            onUpdate={() => { }}
                            onDelete={() => { }}
                            onDuplicate={() => { }}
                            onSelect={() => { }}
                            onAddBlock={() => { }}
                        />
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
};

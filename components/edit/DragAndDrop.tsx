import React from 'react';
import { DndContext, DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { BlockRenderer } from '@/components/blocks/BlockRenderer';
import { Block, createBlock } from '@/shared/index';

interface DragAndDropProps {
    blocks: Block[];
    updateBlock: (blockId: string, block: Block) => void;
    deleteBlock: (blockId: string) => void;
    duplicateBlock: (blockId: string, newBlock: Block) => void;
    reorderBlocks: (fromIndex: number, toIndex: number) => void;
    selectedBlockId: string | null;
    setSelectedBlockId: (blockId: string | null) => void;
}

const DragAndDrop: React.FC<DragAndDropProps> = ({
    blocks,
    updateBlock,
    deleteBlock,
    duplicateBlock,
    reorderBlocks,
    selectedBlockId,
    setSelectedBlockId
}) => {
    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        setSelectedBlockId(active.id as string);
    };

    console.log('blocks', blocks);
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const oldIndex = blocks.findIndex(block => block.id === active.id);
            const newIndex = blocks.findIndex(block => block.id === over.id);
            reorderBlocks(oldIndex, newIndex);
        }
    };

    const handleDuplicateBlock = (blockId: string) => {
        const blockToDuplicate = blocks.find(block => block.id === blockId);
        if (blockToDuplicate) {
            const newBlock = createBlock(blockToDuplicate.type, blockToDuplicate.content);
            duplicateBlock(blockId, newBlock);
        }
    };

    return (
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <SortableContext items={blocks.map(block => block.id)} strategy={verticalListSortingStrategy}>
                {blocks.map(block => (
                    <BlockRenderer
                        key={block.id}
                        block={block}
                        isEditing={true}
                        isSelected={block.id === selectedBlockId}
                        onUpdate={(block) => updateBlock(block.id, block)}
                        onDelete={deleteBlock}
                        onDuplicate={handleDuplicateBlock}
                        onSelect={setSelectedBlockId}
                        onAddBlock={() => { }}
                    />
                ))}
            </SortableContext>
        </DndContext>
    );
};

export default DragAndDrop;
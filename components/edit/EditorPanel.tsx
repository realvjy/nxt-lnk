import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BlockRenderer } from '@/components/blocks/BlockRenderer';
import { useLayoutStore } from '@/lib/stores/layoutStore';
import { Block, createBlock } from '@/shared/index';

interface EditorPanelProps {
    blockId: string;
}

const EditorPanel: React.FC<EditorPanelProps> = ({ blockId }) => {
    const { layout, updateBlock, deleteBlock, duplicateBlock } = useLayoutStore();
    const selectedBlock = layout.find(block => block.id === blockId);

    if (!selectedBlock) return null;

    const handleUpdateBlock = (updatedBlock: any) => {
        updateBlock(updatedBlock);
    };

    const handleDeleteBlock = (blockId: string) => {
        deleteBlock(blockId);
    };

    const handleDuplicateBlock = (blockId: string) => {
        const blockToDuplicate = layout.find(block => block.id === blockId);
        if (blockToDuplicate) {
            const newBlock = createBlock(blockToDuplicate.type, blockToDuplicate.content);
            duplicateBlock(blockId, newBlock);
        }
    };

    const handleSelectBlock = (blockId: string) => {
        // Logic to handle block selection
    };

    const handleAddBlock = (type: Block['type']) => {
        // Logic to add a new block
    };

    return (
        <Card className="sticky top-24">
            <CardContent className="p-4">
                <BlockRenderer
                    block={selectedBlock}
                    isEditing={true}
                    isSelected={true} // Assuming the block is selected in the editor
                    onUpdate={handleUpdateBlock}
                    onDelete={handleDeleteBlock}
                    onDuplicate={handleDuplicateBlock}
                    onSelect={handleSelectBlock}
                    onAddBlock={handleAddBlock}
                />
            </CardContent>
        </Card>
    );
};

export default EditorPanel;
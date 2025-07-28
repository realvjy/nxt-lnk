import React from 'react';
import { Block } from '@/shared/app/blocks';
import { BlockRenderer } from './BlockRenderer';

interface BlocksRendererProps {
    blocks: Block[];
    isEditing: boolean;
    onBlockUpdate: (block: Block) => void;
    onBlockDelete: (blockId: string) => void;
    onBlockAdd: (type: Block['type']) => void;
    onBlockReorder: (fromIndex: number, toIndex: number) => void;
}

/**
 * A component that renders multiple blocks using the single-block BlockRenderer
 */
export const BlocksRenderer: React.FC<BlocksRendererProps> = ({
    blocks,
    isEditing,
    onBlockUpdate,
    onBlockDelete,
    onBlockAdd,
    onBlockReorder
}) => {
    // Empty handler for onDuplicate and onSelect
    const noopHandler = (blockId: string) => { };

    return (
        <div className="space-y-4">
            {blocks.map((block) => (
                <BlockRenderer
                    key={block.id}
                    block={block}
                    isEditing={isEditing}
                    isSelected={false}
                    onUpdate={onBlockUpdate}
                    onDelete={onBlockDelete}
                    onDuplicate={noopHandler}
                    onSelect={noopHandler}
                    onAddBlock={onBlockAdd}
                />
            ))}
        </div>
    );
};

import React from 'react';
import { Block } from '@/types/app/blocks';
import { SortableBlockWrapper } from './SortableBlockWrapper';
import {
    NameBlockView,
    TaglineBlockView,
    BioBlockView,
    ImageBlockView,
    BadgeBlockView,
    LinkBlockView
} from './views';

interface BlockRendererProps {
    block: Block;
    isEditing: boolean;
    isSelected: boolean;
    isDragging?: boolean;
    onUpdate: (block: Block) => void;
    onDelete: (blockId: string) => void;
    onDuplicate: (blockId: string) => void;
    onSelect: (blockId: string) => void;
    onAddBlock: (type: Block['type']) => void;
}

export const BlockRenderer: React.FC<BlockRendererProps> = ({
    block,
    isEditing,
    isSelected,
    isDragging = false,
    onUpdate,
    onDelete,
    onDuplicate,
    onSelect,
    onAddBlock
}) => {
    const renderBlockContent = () => {
        const commonProps = {
            isEditing: false,
            onChange: onUpdate
        };

        switch (block.type) {
            case 'name':
                return <NameBlockView {...commonProps} block={block} />;
            case 'tagline':
                return <TaglineBlockView {...commonProps} block={block} />;
            case 'bio':
                return <BioBlockView {...commonProps} block={block} />;
            case 'image':
                return <ImageBlockView {...commonProps} block={block} />;
            case 'badge':
                return <BadgeBlockView {...commonProps} block={block} />;
            case 'link':
                return <LinkBlockView {...commonProps} block={block} />;
            default:
            // const _exhaustiveCheck: never = block;
            // return (
            //     <div className="p-4 text-center text-muted-foreground border-2 border-dashed border-muted rounded-lg">
            //         <p>Unknown block type: {(block as Block).type}</p>
            //         <p className="text-sm mt-1">This block type is not supported</p>
            //     </div>
            // );
        }
    };

    return (
        <SortableBlockWrapper
            block={block}
            isEditing={isEditing}
            isSelected={isSelected}
            isDragging={isDragging}
            onUpdate={onUpdate}
            onDelete={onDelete}
            onDuplicate={onDuplicate}
            onSelect={onSelect}
            onAddBlock={onAddBlock}
        >
            {renderBlockContent()}
        </SortableBlockWrapper>
    );
};
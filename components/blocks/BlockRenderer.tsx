// components/blocks/BlockRenderer.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Copy,
    Trash2,
    GripVertical
} from 'lucide-react';

// Import all block views
import {
    NameBlockView,
    TaglineBlockView,
    BioBlockView,
    ImageBlockView,
    BadgeBlockView,
    LinkBlockView
} from './views';

import { Block } from '@/shared/blocks';

interface BlockWrapperProps {
    block: Block;
    isEditing: boolean;
    isSelected: boolean;
    onUpdate: (block: Block) => void;
    onDelete: (blockId: string) => void;
    onDuplicate: (blockId: string) => void;
    onSelect: (blockId: string) => void;
    children: React.ReactNode;
}

const BlockWrapper: React.FC<BlockWrapperProps> = ({
    block,
    isEditing,
    isSelected,
    onUpdate,
    onDelete,
    onDuplicate,
    onSelect,
    children
}) => {
    const handleSelect = (e: React.MouseEvent) => {
        e.stopPropagation();
        onSelect(block.id);
    };

    if (!isEditing) {
        return <div className="block-content">{children}</div>;
    }

    return (
        <div
            className={`relative group rounded-lg transition-all cursor-pointer ${isSelected
                ? 'ring-2 ring-blue-500 bg-blue-50/50'
                : 'hover:ring-2 hover:ring-gray-300 hover:bg-gray-50/50'
                }`}
            onClick={handleSelect}
        >
            {/* Drag Handle */}
            <div className="absolute left-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <div className="p-1 bg-white rounded border shadow-sm cursor-grab active:cursor-grabbing">
                    <GripVertical className="w-4 h-4 text-gray-400" />
                </div>
            </div>

            {/* Block Controls */}
            <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                <Button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDuplicate(block.id);
                    }}
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0 bg-white"
                >
                    <Copy className="w-4 h-4" />
                </Button>
                <Button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(block.id);
                    }}
                    variant="destructive"
                    size="sm"
                    className="h-8 w-8 p-0"
                >
                    <Trash2 className="w-4 h-4" />
                </Button>
            </div>

            {/* Block Content */}
            <div className="p-4">
                {children}
            </div>

            {/* Block Type Label */}
            <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Badge variant="secondary" className="text-xs">
                    {block.type}
                </Badge>
            </div>
        </div>
    );
};

interface BlockRendererProps {
    block: Block;
    isEditing: boolean;
    isSelected: boolean;
    onUpdate: (block: Block) => void;
    onDelete: (blockId: string) => void;
    onDuplicate: (blockId: string) => void;
    onSelect: (blockId: string) => void;
}

export const BlockRenderer: React.FC<BlockRendererProps> = ({
    block,
    isEditing,
    isSelected,
    onUpdate,
    onDelete,
    onDuplicate,
    onSelect
}) => {
    const renderBlockContent = () => {
        const commonProps = {
            isEditing: isEditing && isSelected, // Only show editing UI when selected
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
                // TypeScript exhaustiveness check - this should never happen
                const _exhaustiveCheck: never = block;
                return (
                    <div className="p-4 text-center text-muted-foreground border-2 border-dashed border-muted rounded-lg">
                        <p>Unknown block type: {(block as Block).type}</p>
                        <p className="text-sm mt-1">This block type is not supported</p>
                    </div>
                );
        }
    };

    return (
        <BlockWrapper
            block={block}
            isEditing={isEditing}
            isSelected={isSelected}
            onUpdate={onUpdate}
            onDelete={onDelete}
            onDuplicate={onDuplicate}
            onSelect={onSelect}
        >
            {renderBlockContent()}
        </BlockWrapper>
    );
};

export default BlockRenderer;
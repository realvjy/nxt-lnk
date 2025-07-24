// components/blocks/DragDropCanvas.tsx - Main canvas with drop zones
import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, MousePointer } from 'lucide-react';
import { cn } from '@/lib/utils/utils';
import { useBuilderStore } from '@/lib/stores/builderStore';
import { SortableBlockWrapper } from './SortableBlockWrapper';
import { BlockRenderer } from './BlockRenderer';
import type { Block } from '@/shared/blocks';

interface DragDropCanvasProps {
    blocks: Block[];
    onUpdateBlock: (block: Block) => void;
    onDeleteBlock: (id: string) => void;
    onDuplicateBlock: (id: string) => void;
    onSelectBlock: (id: string | null) => void;
    onAddBlock: (type: Block['type']) => void;
    selectedBlockId: string | null;
}

export const DragDropCanvas: React.FC<DragDropCanvasProps> = ({
    blocks,
    onUpdateBlock,
    onDeleteBlock,
    onDuplicateBlock,
    onSelectBlock,
    onAddBlock,
    selectedBlockId,
}) => {
    const { isEditing, isDragging } = useBuilderStore();

    const { setNodeRef, isOver } = useDroppable({
        id: 'canvas-drop-zone',
    });

    if (blocks.length === 0) {
        return (
            <div
                ref={setNodeRef}
                className={cn(
                    "min-h-[400px] border-2 border-dashed rounded-lg transition-colors duration-200",
                    {
                        "border-primary bg-primary/5": isOver,
                        "border-muted-foreground/25": !isOver,
                    }
                )}
            >
                <Card className="h-full">
                    <CardContent className="flex flex-col items-center justify-center py-12 h-full">
                        <div className="text-center space-y-4">
                            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                                <Plus className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-2">
                                    Start Building Your Profile
                                </h3>
                                <p className="text-muted-foreground mb-4">
                                    {isEditing
                                        ? "Add blocks from the sidebar or drag them here to create your profile."
                                        : "No blocks added yet. Switch to edit mode to start building."
                                    }
                                </p>
                                {isEditing && (
                                    <Button onClick={() => onAddBlock('name')}>
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Name Block
                                    </Button>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div
            ref={setNodeRef}
            className={cn(
                "space-y-4 transition-all duration-200 min-h-[200px] relative",
                {
                    "bg-muted/20 rounded-lg p-4": isDragging && isOver,
                }
            )}
        >
            {/* Drag Instructions */}
            {isEditing && blocks.length > 1 && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-blue-700">
                        <MousePointer className="w-4 h-4" />
                        <span>
                            Hover over blocks to see drag handles. Drag blocks to reorder them.
                        </span>
                    </div>
                </div>
            )}

            {/* Blocks */}
            {blocks.map((block) => (
                <SortableBlockWrapper
                    key={block.id}
                    block={block}
                    isEditing={isEditing}
                    isSelected={selectedBlockId === block.id}
                    onSelect={onSelectBlock}
                >
                    <BlockRenderer
                        block={block}
                        isEditing={isEditing}
                        isSelected={selectedBlockId === block.id}
                        onUpdate={onUpdateBlock}
                        onDelete={onDeleteBlock}
                        onDuplicate={onDuplicateBlock}
                        onSelect={onSelectBlock}
                    />
                </SortableBlockWrapper>
            ))}

            {/* Drop Zone Indicator */}
            {isDragging && isOver && (
                <div className="absolute inset-0 border-2 border-primary border-dashed rounded-lg bg-primary/5 flex items-center justify-center">
                    <div className="text-primary font-medium">
                        Drop to reorder blocks
                    </div>
                </div>
            )}
        </div>
    );
};
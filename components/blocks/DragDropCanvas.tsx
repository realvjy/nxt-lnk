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
import { SlashMenu } from "./menu/SlashMenu";
import { useSlashMenu } from "./menu/useSlashMenu";
import { slashMenuItems } from "./menu/menuConfig";
import { BlockType } from "@/lib/constants/blockTypes";

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

    const {
        open,
        query,
        setQuery,
        selected,
        setSelected,
        filtered,
        openMenu,
        closeMenu,
        moveSelection,
        reset,
    } = useSlashMenu();

    if (blocks.length === 0) {
        return (
            <div
                ref={setNodeRef}
                className="min-h-[120px] flex items-center justify-center border rounded bg-muted/40"
            >
                <div style={{ position: "relative", width: "100%" }}>
                    <div
                        contentEditable
                        suppressContentEditableWarning
                        className="outline-none px-4 py-2 w-full empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground/60 before:pointer-events-none"
                        data-placeholder="Type / for blocks..."
                        onKeyDown={e => {
                            if (e.key === "/" && !open) {
                                openMenu();
                                setQuery("");
                            } else if (open) {
                                if (e.key === "ArrowDown") {
                                    e.preventDefault();
                                    moveSelection(1);
                                } else if (e.key === "ArrowUp") {
                                    e.preventDefault();
                                    moveSelection(-1);
                                } else if (e.key === "Enter") {
                                    e.preventDefault();
                                    if (filtered[selected]) {
                                        onAddBlock(filtered[selected].type as BlockType);
                                        reset();
                                    }
                                } else if (e.key === "Escape") {
                                    closeMenu();
                                } else if (e.key.length === 1) {
                                    setQuery(query + e.key);
                                } else if (e.key === "Backspace") {
                                    setQuery(query.slice(0, -1));
                                }
                            }
                        }}
                    />
                    <SlashMenu
                        items={filtered}
                        open={open}
                        selected={selected}
                        onSelect={item => {
                            onAddBlock(item.type as BlockType);
                            reset();
                        }}
                        style={{ position: "absolute", top: "100%", left: 0, width: "100%" }}
                    />
                </div>
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
                        onAddBlock={onAddBlock}
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
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Copy,
    Trash2,
    GripVertical,
    MoreVertical,
    Edit
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/lib/utils/utils';

// Import all block views
import {
    NameBlockView,
    TaglineBlockView,
    BioBlockView,
    ImageBlockView,
    BadgeBlockView,
    LinkBlockView
} from './views';

import { Block } from '@/shared/app/blocks';
import { SlashMenu } from './menu/SlashMenu';
import { BlockTypeConfig, BLOCK_TYPES } from '@/lib/constants/blockTypes';


interface SortableBlockWrapperProps {
    block: Block;
    isEditing: boolean;
    isSelected: boolean;
    isDragging?: boolean;
    onUpdate: (block: Block) => void;
    onDelete: (blockId: string) => void;
    onDuplicate: (blockId: string) => void;
    onSelect: (blockId: string) => void;
    onAddBlock: (type: Block['type']) => void;
    children: React.ReactNode;
}

const SortableBlockWrapper: React.FC<SortableBlockWrapperProps> = ({
    block,
    isEditing,
    isSelected,
    isDragging = false,
    onUpdate,
    onDelete,
    onDuplicate,
    onSelect,
    onAddBlock,
    children
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

    const handleSelect = (e: React.MouseEvent) => {
        if (!isEditing) return;
        e.stopPropagation();
        onSelect(block.id);
    };

    const handleDuplicate = (e: React.MouseEvent) => {
        e.stopPropagation();
        onDuplicate(block.id);
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        onDelete(block.id);
    };

    const [open, setOpen] = React.useState(false);
    const [query, setQuery] = React.useState("");
    const [selected, setSelected] = React.useState(0);
    const filtered = React.useMemo(() => {
        return BLOCK_TYPES.filter((item) =>
            item.type.toLowerCase().includes(query.toLowerCase()) ||
            item.label.toLowerCase().includes(query.toLowerCase()) ||
            item.description.toLowerCase().includes(query.toLowerCase())
        );
    }, [query]);

    const openMenu = () => {
        setOpen(true);
    };

    const closeMenu = () => {
        setOpen(false);
        setQuery("");
    };

    const reset = () => {
        closeMenu();
        setSelected(0);
    };

    const moveSelection = (direction: number) => {
        setSelected((prev) => (prev + direction + filtered.length) % filtered.length);
    };

    // If not editing, render without drag functionality
    if (!isEditing) {
        return (
            <div className="block-content mb-4">
                {children}
            </div>
        );
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                "group relative transition-all duration-200 mb-4",
                {
                    "opacity-50": isSortableDragging || isDragging,
                    "cursor-move": isEditing,
                    "hover:shadow-md": isEditing && !isSortableDragging,
                }
            )}
            onClick={handleSelect}
            {...attributes}
        >
            {/* Drag Handle - Left side */}
            <div
                className={cn(
                    "absolute -left-10 top-1/2 transform -translate-y-1/2 z-20",
                    "opacity-0 group-hover:opacity-100 transition-opacity duration-200",
                    "cursor-grab active:cursor-grabbing",
                    "p-2 bg-background border rounded-md shadow-sm",
                    {
                        "opacity-100": isSelected,
                    }
                )}
                {...listeners}
            >
                <GripVertical className="w-4 h-4 text-muted-foreground" />
            </div>

            {/* Main Block Container */}
            <div
                className={cn(
                    "relative rounded-lg transition-all duration-200 cursor-pointer",
                    {
                        "ring-2 ring-primary ring-offset-2 bg-primary/5": isSelected,
                        "hover:ring-2 hover:ring-muted-foreground/30 hover:bg-muted/20": !isSelected,
                        "transform scale-105": isSelected,
                        "pointer-events-none": isSortableDragging,
                    }
                )}
            >
                {/* Block Controls - Right side with dropdown */}
                <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="secondary"
                                size="sm"
                                className="h-8 w-8 p-0 shadow-sm bg-background"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <MoreVertical className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem onClick={() => onSelect(block.id)}>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit Block
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleDuplicate}>
                                <Copy className="w-4 h-4 mr-2" />
                                Duplicate Block
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={handleDelete}
                                className="text-destructive focus:text-destructive"
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete Block
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Block Content */}
                <div className="p-4">
                    {children}
                    {isEditing && (
                        <div className="mt-2 border-t pt-2">
                            <div
                                contentEditable
                                suppressContentEditableWarning
                                className="outline-none w-full text-sm text-muted-foreground empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground/60 before:pointer-events-none"
                                data-placeholder="Type / for blocks..."
                                onKeyDown={(e) => {
                                    if (e.key === "/" && !open) {
                                        openMenu();
                                        setQuery("");
                                        e.preventDefault();
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
                                                onAddBlock(filtered[selected].type);
                                                reset();
                                            }
                                        } else if (e.key === "Escape") {
                                            closeMenu();
                                        } else if (e.key.length === 1) {
                                            setQuery(query + e.key);
                                        } else if (e.key === "Backspace") {
                                            setQuery(query.slice(0, -1));
                                            if (query.length === 0) {
                                                closeMenu();
                                            }
                                        }
                                    }
                                }}
                            />
                            {open && (
                                <SlashMenu
                                    items={filtered}
                                    open={open}
                                    selected={selected}
                                    onSelect={(item) => {
                                        onAddBlock(item.type);
                                        reset();
                                    }}
                                    style={{ position: "absolute", bottom: "-1rem", left: 0, width: "100%", zIndex: 50 }}
                                />
                            )}
                        </div>
                    )}
                </div>

                {/* Block Type Label - Bottom left */}
                <div className={cn(
                    "absolute bottom-2 left-2 transition-opacity duration-200",
                    "opacity-0 group-hover:opacity-100",
                    {
                        "opacity-100": isSelected,
                    }
                )}>
                    <Badge
                        variant={isSelected ? "default" : "secondary"}
                        className="text-xs font-medium"
                    >
                        {block.type}
                    </Badge>
                </div>

                {/* Selection Indicator */}
                {isSelected && (
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-2 right-12">
                            <Badge className="bg-primary text-primary-foreground text-xs px-2 py-1">
                                Selected
                            </Badge>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

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
            isEditing: false, // Views should always be in display mode
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

export default BlockRenderer;

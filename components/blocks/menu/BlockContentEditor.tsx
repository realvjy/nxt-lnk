import React from 'react';
import { SlashMenu } from './SlashMenu';
import { useSlashMenu } from './useSlashMenu';
import { Block } from '@/shared/blocks';
import { BlockType } from '@/lib/constants/blockTypes';

interface BlockContentEditorProps {
    block: Block;
    onAddBlock: (type: BlockType) => void;
    children: React.ReactNode;
}

export const BlockContentEditor: React.FC<BlockContentEditorProps> = ({
    block,
    onAddBlock,
    children
}) => {
    const {
        open,
        query,
        setQuery,
        selected,
        filtered,
        openMenu,
        closeMenu,
        moveSelection,
        reset,
    } = useSlashMenu();

    return (
        <div style={{ position: 'relative' }}>
            <div
                contentEditable
                suppressContentEditableWarning
                className="outline-none w-full empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground/60 before:pointer-events-none"
                data-placeholder="Type / for blocks..."
                onKeyDown={e => {
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
                                onAddBlock(filtered[selected].type as BlockType);
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
            >
                {children}
            </div>
            <SlashMenu
                items={filtered}
                open={open}
                selected={selected}
                onSelect={item => {
                    onAddBlock(item.type as BlockType);
                    reset();
                }}
                style={{ position: "absolute", top: "100%", left: 0, width: "100%", zIndex: 50 }}
            />
        </div>
    );
};
// components/blocks/menu/SlashMenu.tsx
import React from "react";
import { SlashMenuItem } from "./SlashMenuItem";
import { BlockTypeConfig } from "@/lib/constants/blockTypes";

interface SlashMenuProps {
    items: BlockTypeConfig[];
    open: boolean;
    selected: number;
    onSelect: (item: BlockTypeConfig) => void;
    style?: React.CSSProperties;
}

export const SlashMenu: React.FC<SlashMenuProps> = ({
    items,
    open,
    selected,
    onSelect,
    style
}) => {
    if (!open || items.length === 0) return null;
    return (
        <div
            className="absolute z-50 w-72 bg-popover border rounded shadow-lg mt-2"
            style={style}
        >
            {items.map((item, idx) => (
                <SlashMenuItem
                    key={item.type}
                    item={item}
                    selected={selected === idx}
                    onClick={() => onSelect(item)}
                />
            ))}
        </div>
    );
};
import React from "react";
import { BlockTypeConfig } from "@/lib/constants/blockTypes";
import { cn } from "@/lib/utils/utils";

interface SlashMenuItemProps {
    item: BlockTypeConfig;
    selected: boolean;
    onClick: () => void;
}

export const SlashMenuItem: React.FC<SlashMenuItemProps> = ({ item, selected, onClick }) => {
    const Icon = item.icon;
    return (
        <div
            className={cn(
                "flex items-center px-3 py-2 cursor-pointer rounded",
                selected ? "bg-accent text-accent-foreground" : "hover:bg-muted"
            )}
            onClick={onClick}
            tabIndex={-1}
        >
            <Icon className="mr-2 h-5 w-5" />
            <div>
                <div className="font-medium">{item.label}</div>
                <div className="text-xs text-muted-foreground">{item.description}</div>
            </div>
        </div>
    );
};
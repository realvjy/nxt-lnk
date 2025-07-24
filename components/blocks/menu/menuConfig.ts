// components/blocks/menu/menuConfig.ts
import { BLOCK_TYPES, BlockTypeConfig } from "@/lib/constants/blockTypes";

export const slashMenuItems = BLOCK_TYPES.map(block => ({
    ...block,
    search: `${block.label.toLowerCase()} ${block.description.toLowerCase()}`
}));

export type SlashMenuItem = BlockTypeConfig & {
    search: string;
};
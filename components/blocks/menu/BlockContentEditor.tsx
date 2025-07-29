import React from 'react';
import { SlashMenu } from './SlashMenu';
import { useSlashMenu } from './useSlashMenu';
import { Block } from '@/types/app/blocks';
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

    return (
        <div style={{ position: 'relative' }}>
            Block Editor

            Slash Menu Link
        </div>
    );
};
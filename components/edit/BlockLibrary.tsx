import React from 'react';
import { Button } from '@/components/ui/button';
import { blockTypes } from '@/shared/index';

interface BlockLibraryProps {
    addBlock: (type: string) => void;
}

const BlockLibrary: React.FC<BlockLibraryProps> = ({ addBlock }) => {
    return (
        <div className="space-y-4">
            <h3 className="font-semibold">Block Library</h3>
            {blockTypes.map((block) => (
                <Button key={block.type} onClick={() => addBlock(block.type)}>
                    {block.label}
                </Button>
            ))}
        </div>
    );
};

export default BlockLibrary;
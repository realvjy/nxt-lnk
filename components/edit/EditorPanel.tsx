import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
    NameBlockEditor,
    TaglineBlockEditor,
    BioBlockEditor,
    BadgeBlockEditor,
    ImageBlockEditor,
    LinkBlockEditor
} from '@/components/blocks/editors';
import { Block } from '@/shared/index';
import { useLayoutStore } from '@/lib/stores/layoutStore';

interface EditorPanelProps {
    blockId: string | null; // Ensure this can be null
    updateBlock: (updatedBlock: Block) => void; // Add this line
    deleteBlock: (blockId: string) => void; // Add this line
    duplicateBlock: (blockId: string, newBlock: Block) => void; // Add this line
}

const EditorPanel: React.FC<EditorPanelProps> = ({ blockId, updateBlock, deleteBlock, duplicateBlock }) => {
    const { layout } = useLayoutStore();
    const selectedBlock = layout.find(block => block.id === blockId);

    if (!selectedBlock) return <div>No block selected</div>;

    const handleUpdateBlock = (updatedBlock: Block) => {
        updateBlock(updatedBlock);
    };

    const renderEditorContent = () => {
        switch (selectedBlock.type) {
            case 'name':
                return (
                    <NameBlockEditor
                        block={selectedBlock}
                        onChange={handleUpdateBlock}
                    />
                );
            case 'tagline':
                return (
                    <TaglineBlockEditor
                        block={selectedBlock}
                        onChange={handleUpdateBlock}
                    />
                );
            case 'bio':
                return (
                    <BioBlockEditor
                        block={selectedBlock}
                        onChange={handleUpdateBlock}
                    />
                );
            case 'image':
                return (
                    <ImageBlockEditor
                        block={selectedBlock}
                        onChange={handleUpdateBlock}
                    />
                );
            case 'badge':
                return (
                    <BadgeBlockEditor
                        block={selectedBlock}
                        onChange={handleUpdateBlock}
                    />
                );
            case 'link':
                return (
                    <LinkBlockEditor
                        block={selectedBlock}
                        onChange={handleUpdateBlock}
                    />
                );
            default:
                return <div>No editor available for this block type</div>;
        }
    };

    return (
        <Card className="sticky top-24">
            <CardContent className="p-4">
                <h3>Edit Block</h3>
                {renderEditorContent()}
            </CardContent>
        </Card>
    );
};

export default EditorPanel;
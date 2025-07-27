import { useLayoutStore } from '@/lib/stores/layoutStore';
import { Card, CardContent } from '../ui/card';
import { Block, NameBlockType, TaglineBlockType, BioBlockType, ImageBlockType, BadgeBlockType, LinkBlockType } from '@/shared/app/blocks';
import { NameBlockEditor } from '@/components/blocks/editors/NameBlockEditor';
import { TaglineBlockEditor } from '@/components/blocks/editors/TaglineBlockEditor';
import { BioBlockEditor } from '@/components/blocks/editors/BioBlockEditor';
import { ImageBlockEditor } from '@/components/blocks/editors/ImageBlockEditor';
import { BadgeBlockEditor } from '@/components/blocks/editors/BadgeBlockEditor';
import { LinkBlockEditor } from '@/components/blocks/editors/LinkBlockEditor';

interface EditorPanelProps {
    blockId: string | null;
    updateBlock: (block: Block) => void;
    deleteBlock: (id: string) => void;
    duplicateBlock: (block: Block) => void; // or the correct type if not (block: Block)
}

const EditorPanel: React.FC<EditorPanelProps> = ({ blockId, updateBlock }) => {
    const { layout } = useLayoutStore();
    const selectedBlock = layout.find(block => block.id === blockId);

    if (!selectedBlock) return <div>No block selected</div>;

    let editor = null;

    switch (selectedBlock.type) {
        case 'name':
            editor = (
                <NameBlockEditor
                    block={selectedBlock as NameBlockType}
                    onChange={updateBlock}
                />
            );
            break;
        case 'tagline':
            editor = (
                <TaglineBlockEditor
                    block={selectedBlock as TaglineBlockType}
                    onChange={updateBlock}
                />
            );
            break;
        case 'bio':
            editor = (
                <BioBlockEditor
                    block={selectedBlock as BioBlockType}
                    onChange={updateBlock}
                />
            );
            break;
        case 'image':
            editor = (
                <ImageBlockEditor
                    block={selectedBlock as ImageBlockType}
                    onChange={updateBlock}
                />
            );
            break;
        case 'badge':
            editor = (
                <BadgeBlockEditor
                    block={selectedBlock as BadgeBlockType}
                    onChange={updateBlock}
                />
            );
            break;
        case 'link':
            editor = (
                <LinkBlockEditor
                    block={selectedBlock as LinkBlockType}
                    onChange={updateBlock}
                />
            );
            break;
        default:
            editor = <div>No editor available for this block type</div>;
    }

    return (
        <Card className="sticky top-24">
            <CardContent className="p-4">
                <h3>Edit Block</h3>
                {editor}
            </CardContent>
        </Card>
    );
};

export default EditorPanel;
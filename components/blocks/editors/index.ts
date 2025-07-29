export { NameBlockEditor } from './NameBlockEditor';
export { TaglineBlockEditor } from './TaglineBlockEditor';
export { BioBlockEditor } from './BioBlockEditor';
export { ImageBlockEditor } from './ImageBlockEditor';
export { BadgeBlockEditor } from './BadgeBlockEditor';
export { LinkBlockEditor } from './LinkBlockEditor';

// Import for the object exports
import { NameBlockEditor } from './NameBlockEditor';
import { TaglineBlockEditor } from './TaglineBlockEditor';
import { BioBlockEditor } from './BioBlockEditor';
import { ImageBlockEditor } from './ImageBlockEditor';
import { BadgeBlockEditor } from './BadgeBlockEditor';
import { LinkBlockEditor } from './LinkBlockEditor';
import { BadgeBlockType, BioBlockType, ImageBlockType, LinkBlockType, NameBlockType, TaglineBlockType } from '@/types/app/blocks';
// Re-export all editors as a convenient object
export const BlockEditors = {
    NameBlockEditor,
    TaglineBlockEditor,
    BioBlockEditor,
    ImageBlockEditor,
    BadgeBlockEditor,
    LinkBlockEditor,
} as const;

// Editor type mapping for dynamic editor selection
export const EDITOR_MAP: {
    [K in keyof BlockTypeMap]: React.ComponentType<{
        block: BlockTypeMap[K];
        onChange: (block: BlockTypeMap[K]) => void;
    }>;
} = {
    name: NameBlockEditor,
    tagline: TaglineBlockEditor,
    bio: BioBlockEditor,
    image: ImageBlockEditor,
    badge: BadgeBlockEditor,
    link: LinkBlockEditor,
};

export type BlockTypeMap = {
    name: NameBlockType;
    tagline: TaglineBlockType;
    bio: BioBlockType;
    image: ImageBlockType;
    badge: BadgeBlockType;
    link: LinkBlockType;
};

// Helper function to get editor component by block type
export const getEditorComponent = (blockType: string) => {
    return EDITOR_MAP[blockType as keyof typeof EDITOR_MAP];
};
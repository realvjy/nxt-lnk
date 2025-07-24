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
export const EDITOR_MAP = {
    name: NameBlockEditor,
    tagline: TaglineBlockEditor,
    bio: BioBlockEditor,
    image: ImageBlockEditor,
    badge: BadgeBlockEditor,
    link: LinkBlockEditor,
} as const;

// Helper function to get editor component by block type
export const getEditorComponent = (blockType: string) => {
    return EDITOR_MAP[blockType as keyof typeof EDITOR_MAP];
};
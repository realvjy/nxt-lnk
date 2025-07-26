import React from 'react';
import { BioBlockType } from '@/shared/app/blocks';

interface BioBlockViewProps {
    block: BioBlockType;
    isEditing: boolean;
    onChange: (block: BioBlockType) => void;
}

export const BioBlockView: React.FC<BioBlockViewProps> = ({
    block,
    isEditing,
    onChange
}) => {
    // For the new system, we don't show inline editing in the view
    // All editing happens in the dedicated editor panel

    // If there's no content, show a placeholder
    if (!block.content.text || block.content.text.trim() === '' || block.content.text === '<p></p>') {
        return (
            <div className="text-center max-w-2xl mx-auto">
                <div className="text-muted-foreground leading-relaxed py-8 px-4 border-2 border-dashed border-muted-foreground/25 rounded-lg">
                    {isEditing
                        ? 'Click to edit your bio...'
                        : 'No bio added yet'
                    }
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div
                className="bio-content text-muted-foreground leading-relaxed"
                dangerouslySetInnerHTML={{
                    __html: block.content.text
                }}
            />
        </div>
    );
};

export default BioBlockView;
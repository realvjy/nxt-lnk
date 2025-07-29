import React from 'react';
import { BioBlockType } from '@/types/app/blocks';

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
                Slash Menu Link
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            Slash Menu Link
        </div>
    );
};

export default BioBlockView;
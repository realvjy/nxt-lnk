import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TaglineBlockType } from '@/types/app/blocks';

interface TaglineBlockViewProps {
    block: TaglineBlockType;
    isEditing: boolean;
    onChange: (block: TaglineBlockType) => void;
}

export const TaglineBlockView: React.FC<TaglineBlockViewProps> = ({
    block,
    isEditing,
    onChange
}) => {
    if (isEditing) {
        return (
            <div className="space-y-2">

            </div>
        );
    }

    return (
        <div className="text-center">

        </div>
    );
};

export default TaglineBlockView;
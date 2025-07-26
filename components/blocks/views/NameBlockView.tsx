import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { NameBlockType } from '@/shared/app/blocks';

interface NameBlockViewProps {
    block: NameBlockType;
    isEditing: boolean;
    onChange: (block: NameBlockType) => void;
}

export const NameBlockView: React.FC<NameBlockViewProps> = ({
    block,
    isEditing,
    onChange
}) => {
    if (isEditing) {
        return (
            <div className="space-y-2">
                <Label htmlFor={`name-${block.id}`}>Full Name</Label>
                <Input
                    id={`name-${block.id}`}
                    value={block.content?.text || ''}
                    onChange={(e) => onChange({
                        ...block,
                        content: { ...block.content, text: e.target.value }
                    })}
                    placeholder="Enter your full name"
                    className="text-center"
                />
            </div>
        );
    }

    return (
        <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground leading-tight">
                {block.content?.text || 'Your Name'}
            </h1>
        </div>
    );
};

export default NameBlockView;
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TaglineBlockType } from '@/shared/app/blocks';

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
                <Label htmlFor={`tagline-${block.id}`}>Tagline</Label>
                <Input
                    id={`tagline-${block.id}`}
                    value={block.content.text}
                    onChange={(e) => onChange({
                        ...block,
                        content: { ...block.content, text: e.target.value }
                    })}
                    placeholder="What do you do?"
                    className="text-center"
                />
            </div>
        );
    }

    return (
        <div className="text-center">
            <p className="text-lg text-muted-foreground leading-relaxed">
                {block.content.text || 'Your tagline here'}
            </p>
        </div>
    );
};

export default TaglineBlockView;
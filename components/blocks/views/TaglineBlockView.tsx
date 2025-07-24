// components/blocks/views/TaglineBlockView.tsx
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TaglineBlockType } from '@/shared/blocks';

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
                    value={block.props.text}
                    onChange={(e) => onChange({
                        ...block,
                        props: { ...block.props, text: e.target.value }
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
                {block.props.text || 'Your tagline here'}
            </p>
        </div>
    );
};

export default TaglineBlockView;
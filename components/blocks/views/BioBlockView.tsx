// components/blocks/views/BioBlockView.tsx
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { BioBlockType } from '@/shared/blocks';

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
    if (isEditing) {
        return (
            <div className="space-y-2">
                <Label htmlFor={`bio-${block.id}`}>Bio</Label>
                <Textarea
                    id={`bio-${block.id}`}
                    value={block.props.text}
                    onChange={(e) => onChange({
                        ...block,
                        props: { ...block.props, text: e.target.value }
                    })}
                    placeholder="Tell people about yourself..."
                    rows={4}
                    className="text-center resize-none"
                />
                <div className="text-xs text-muted-foreground text-right">
                    {block.props.text.length}/500
                </div>
            </div>
        );
    }

    return (
        <div className="text-center max-w-2xl mx-auto">
            <div
                className="text-muted-foreground leading-relaxed prose prose-sm mx-auto"
                dangerouslySetInnerHTML={{
                    __html: block.props.text || 'Your bio will appear here...'
                }}
            />
        </div>
    );
};

export default BioBlockView;
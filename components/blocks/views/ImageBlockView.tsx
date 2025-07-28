'use client';
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ImageBlockType } from '@/shared/app/blocks';
import { Upload, X } from 'lucide-react';

interface ImageBlockViewProps {
    block: ImageBlockType;
    isEditing: boolean;
    onChange: (block: ImageBlockType) => void;
}

export const ImageBlockView: React.FC<ImageBlockViewProps> = ({
    block,
    isEditing,
    onChange
}) => {
    const [imageError, setImageError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleImageLoad = () => {
        setImageError(false);
        setIsLoading(false);
    };

    const handleImageError = () => {
        setImageError(true);
        setIsLoading(false);
    };

    const clearImage = () => {
        onChange({
            ...block,
            content: { ...block.content, url: '', alt: '' }
        });
        setImageError(false);
    };

    if (isEditing) {
        return (
            <div className="space-y-4">
                Image Block Editor
            </div>
        );
    }

    // Display mode
    if (!block.content.url) {
        return (
            <div className="text-center">
                Image Block View
            </div>
        );
    }

    return (
        <div className="text-center">
            Image Block View
        </div>
    );
};

export default ImageBlockView;
'use client';
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ImageBlockType } from '@/shared/blocks';
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
            props: { ...block.props, url: '', alt: '' }
        });
        setImageError(false);
    };

    if (isEditing) {
        return (
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor={`image-url-${block.id}`}>Image URL</Label>
                    <div className="flex gap-2">
                        <Input
                            id={`image-url-${block.id}`}
                            value={block.props.url}
                            onChange={(e) => {
                                setIsLoading(true);
                                setImageError(false);
                                onChange({
                                    ...block,
                                    props: { ...block.props, url: e.target.value }
                                });
                            }}
                            placeholder="https://example.com/image.jpg"
                        />
                        {block.props.url && (
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={clearImage}
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        )}
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor={`image-alt-${block.id}`}>Alt Text</Label>
                    <Input
                        id={`image-alt-${block.id}`}
                        value={block.props.alt || ''}
                        onChange={(e) => onChange({
                            ...block,
                            props: { ...block.props, alt: e.target.value }
                        })}
                        placeholder="Describe the image for accessibility"
                    />
                </div>

                {/* Image Preview */}
                {block.props.url && (
                    <div className="space-y-2">
                        <Label>Preview</Label>
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex justify-center">
                                    {isLoading && (
                                        <div className="w-24 h-24 rounded-full bg-muted animate-pulse" />
                                    )}
                                    {!isLoading && !imageError && (
                                        <img
                                            src={block.props.url}
                                            alt={block.props.alt}
                                            className="w-24 h-24 rounded-full object-cover border-4 border-background shadow-lg"
                                            onLoad={handleImageLoad}
                                            onError={handleImageError}
                                            style={{ display: isLoading ? 'none' : 'block' }}
                                        />
                                    )}
                                    {!isLoading && imageError && (
                                        <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
                                            <Upload className="w-8 h-8 text-muted-foreground" />
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        );
    }

    // Display mode
    if (!block.props.url) {
        return (
            <div className="text-center">
                <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center mx-auto">
                    <Upload className="w-12 h-12 text-muted-foreground" />
                </div>
            </div>
        );
    }

    return (
        <div className="text-center">
            {!imageError ? (
                <img
                    src={block.props.url}
                    alt={block.props.alt || 'Profile image'}
                    className="w-32 h-32 rounded-full object-cover border-4 border-background shadow-lg mx-auto transition-transform hover:scale-105"
                    onError={handleImageError}
                />
            ) : (
                <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center mx-auto">
                    <Upload className="w-12 h-12 text-muted-foreground" />
                </div>
            )}
        </div>
    );
};

export default ImageBlockView;
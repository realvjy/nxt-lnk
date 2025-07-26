
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { ImageBlockType } from '@/shared/app/blocks';
import { Image, Upload, X, Eye, Settings, Crop } from 'lucide-react';

interface ImageBlockEditorProps {
    block: ImageBlockType;
    onChange: (block: ImageBlockType) => void;
    onClose?: () => void;
}

// Fixed interface - no extending from union type
interface ExtendedImageProps {
    url: string;
    alt?: string;
    size?: 'small' | 'medium' | 'large' | 'xl';
    shape?: 'circle' | 'rounded' | 'square';
    border?: boolean;
    borderWidth?: number;
    shadow?: 'none' | 'small' | 'medium' | 'large';
}

export const ImageBlockEditor: React.FC<ImageBlockEditorProps> = ({
    block,
    onChange,
    onClose
}) => {
    const [localProps, setLocalProps] = useState<ExtendedImageProps>({
        url: block.content.url,
        alt: block.content.alt,
        size: 'large',
        shape: 'circle',
        border: true,
        borderWidth: 4,
        shadow: 'medium'
    });

    const [imageError, setImageError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<string[]>([]);

    useEffect(() => {
        const newErrors: string[] = [];

        if (localProps.url && !isValidUrl(localProps.url)) {
            newErrors.push('Please enter a valid image URL');
        }

        setErrors(newErrors);
    }, [localProps.url]);

    const isValidUrl = (url: string): boolean => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };

    const handleChange = (key: keyof ExtendedImageProps, value: any) => {
        const newProps = { ...localProps, [key]: value };
        setLocalProps(newProps);

        if (key === 'url') {
            setIsLoading(true);
            setImageError(false);
        }

        onChange({
            ...block,
            content: {
                url: newProps.url,
                alt: newProps.alt
            }
        });
    };

    const handleImageLoad = () => {
        setImageError(false);
        setIsLoading(false);
    };

    const handleImageError = () => {
        setImageError(true);
        setIsLoading(false);
    };

    const clearImage = () => {
        handleChange('url', '');
        handleChange('alt', '');
        setImageError(false);
    };

    const sizeOptions = [
        { value: 'small', label: 'Small (80px)', size: 'w-20 h-20' },
        { value: 'medium', label: 'Medium (100px)', size: 'w-25 h-25' },
        { value: 'large', label: 'Large (120px)', size: 'w-30 h-30' },
        { value: 'xl', label: 'Extra Large (150px)', size: 'w-38 h-38' }
    ];

    const shapeOptions = [
        { value: 'circle', label: 'Circle', class: 'rounded-full' },
        { value: 'rounded', label: 'Rounded', class: 'rounded-xl' },
        { value: 'square', label: 'Square', class: 'rounded-none' }
    ];

    const shadowOptions = [
        { value: 'none', label: 'None', class: '' },
        { value: 'small', label: 'Small', class: 'shadow-sm' },
        { value: 'medium', label: 'Medium', class: 'shadow-lg' },
        { value: 'large', label: 'Large', class: 'shadow-xl' }
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Image className="w-5 h-5" />
                    <h3 className="text-lg font-semibold">Edit Image Block</h3>
                </div>
                {onClose && (
                    <Button variant="outline" size="sm" onClick={onClose}>
                        Done
                    </Button>
                )}
            </div>

            {/* Image Upload/URL */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Upload className="w-4 h-4" />
                        Image Source
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="image-url">Image URL</Label>
                        <div className="flex gap-2">
                            <Input
                                id="image-url"
                                value={localProps.url}
                                onChange={(e) => handleChange('url', e.target.value)}
                                placeholder="https://example.com/image.jpg"
                                className={errors.length > 0 ? 'border-red-500' : ''}
                            />
                            {localProps.url && (
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
                        {errors.length > 0 && (
                            <div className="text-sm text-red-500">{errors[0]}</div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="image-alt">Alt Text (for accessibility)</Label>
                        <Input
                            id="image-alt"
                            value={localProps.alt || ''}
                            onChange={(e) => handleChange('alt', e.target.value)}
                            placeholder="Describe the image"
                        />
                        <div className="text-xs text-muted-foreground">
                            Alt text helps screen readers describe your image
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Style Settings */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Settings className="w-4 h-4" />
                        Style Settings
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Size</Label>
                            <Select
                                value={localProps.size}
                                onValueChange={(value) => handleChange('size', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {sizeOptions.map(option => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Shape</Label>
                            <Select
                                value={localProps.shape}
                                onValueChange={(value) => handleChange('shape', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {shapeOptions.map(option => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Shadow</Label>
                            <Select
                                value={localProps.shadow}
                                onValueChange={(value) => handleChange('shadow', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {shadowOptions.map(option => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Border Width: {localProps.borderWidth}px</Label>
                            <Slider
                                value={[localProps.borderWidth || 0]}
                                onValueChange={([value]) => handleChange('borderWidth', value)}
                                min={0}
                                max={10}
                                step={1}
                                className="w-full"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Preview */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        Preview
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-center p-8 bg-muted/20 rounded-lg">
                        {!localProps.url ? (
                            <div className={`
                                ${sizeOptions.find(s => s.value === localProps.size)?.size || 'w-30 h-30'}
                                ${shapeOptions.find(s => s.value === localProps.shape)?.class || 'rounded-full'}
                                bg-muted border-2 border-dashed border-muted-foreground/50
                                flex items-center justify-center
                            `}>
                                <Upload className="w-8 h-8 text-muted-foreground" />
                            </div>
                        ) : (
                            <>
                                {isLoading && (
                                    <div className={`
                                        ${sizeOptions.find(s => s.value === localProps.size)?.size || 'w-30 h-30'}
                                        ${shapeOptions.find(s => s.value === localProps.shape)?.class || 'rounded-full'}
                                        bg-muted animate-pulse
                                    `} />
                                )}
                                {!isLoading && !imageError && (
                                    <img
                                        src={localProps.url}
                                        alt={localProps.alt}
                                        className={`
                                            ${sizeOptions.find(s => s.value === localProps.size)?.size || 'w-30 h-30'}
                                            ${shapeOptions.find(s => s.value === localProps.shape)?.class || 'rounded-full'}
                                            ${shadowOptions.find(s => s.value === localProps.shadow)?.class || 'shadow-lg'}
                                            object-cover transition-transform hover:scale-105
                                        `}
                                        style={{
                                            border: localProps.borderWidth ? `${localProps.borderWidth}px solid white` : undefined
                                        }}
                                        onLoad={handleImageLoad}
                                        onError={handleImageError}
                                    />
                                )}
                                {!isLoading && imageError && (
                                    <div className={`
                                        ${sizeOptions.find(s => s.value === localProps.size)?.size || 'w-30 h-30'}
                                        ${shapeOptions.find(s => s.value === localProps.shape)?.class || 'rounded-full'}
                                        bg-muted border-2 border-red-300
                                        flex items-center justify-center
                                    `}>
                                        <X className="w-8 h-8 text-red-500" />
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                handleChange('size', 'large');
                                handleChange('shape', 'circle');
                                handleChange('shadow', 'medium');
                                handleChange('borderWidth', 4);
                            }}
                        >
                            Profile Style
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                handleChange('size', 'xl');
                                handleChange('shape', 'rounded');
                                handleChange('shadow', 'large');
                                handleChange('borderWidth', 0);
                            }}
                        >
                            Hero Style
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                handleChange('size', 'medium');
                                handleChange('shape', 'square');
                                handleChange('shadow', 'none');
                                handleChange('borderWidth', 1);
                            }}
                        >
                            Minimal Style
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ImageBlockEditor;
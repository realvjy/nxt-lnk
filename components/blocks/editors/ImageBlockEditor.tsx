import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { ImageBlockType } from '@/shared/app/blocks';
import { Image, Upload, X, Eye, Settings } from 'lucide-react';

interface ImageBlockEditorProps {
    block: ImageBlockType;
    onChange: (block: ImageBlockType) => void;
    onClose?: () => void;
}

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
            Image Block Editor
        </div>
    );
};

export default ImageBlockEditor;
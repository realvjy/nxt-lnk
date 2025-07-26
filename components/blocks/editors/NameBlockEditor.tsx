import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { NameBlockType } from '@/shared/app/blocks';
import { User, Type, Palette } from 'lucide-react';

interface NameBlockEditorProps {
    block: NameBlockType;
    onChange: (block: NameBlockType) => void;
    onClose?: () => void;
}

// Extended props for styling (you can add these to your block type later)
interface ExtendedNameProps {
    text: string;
    fontSize?: 'small' | 'medium' | 'large' | 'xl';
    fontWeight?: 'normal' | 'medium' | 'semibold' | 'bold';
    textAlign?: 'left' | 'center' | 'right';
    color?: string;
    letterSpacing?: 'tight' | 'normal' | 'wide';
}

export const NameBlockEditor: React.FC<NameBlockEditorProps> = ({
    block,
    onChange,
    onClose
}) => {
    const [localProps, setLocalProps] = useState<ExtendedNameProps>({
        text: block.content?.text || '',
        fontSize: 'large',
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#000000',
        letterSpacing: 'normal'
    });

    const [errors, setErrors] = useState<string[]>([]);

    // Validate on change
    useEffect(() => {
        const newErrors: string[] = [];

        if (!localProps.text?.trim()) {
            newErrors.push('Name cannot be empty');
        }

        if (localProps.text && localProps.text.length > 100) {
            newErrors.push('Name must be less than 100 characters');
        }

        setErrors(newErrors);
    }, [localProps.text]);

    const handleChange = (key: keyof ExtendedNameProps, value: any) => {
        const newProps = { ...localProps, [key]: value };
        setLocalProps(newProps);

        // Update the block with basic props
        onChange({
            ...block,
            content: {
                ...(block.content || {}),
                text: newProps.text
            }
        });
    };

    const fontSizeOptions = [
        { value: 'small', label: 'Small (1.5rem)', class: 'text-2xl' },
        { value: 'medium', label: 'Medium (2rem)', class: 'text-3xl' },
        { value: 'large', label: 'Large (2.5rem)', class: 'text-4xl' },
        { value: 'xl', label: 'Extra Large (3rem)', class: 'text-5xl' }
    ];

    const fontWeightOptions = [
        { value: 'normal', label: 'Normal', class: 'font-normal' },
        { value: 'medium', label: 'Medium', class: 'font-medium' },
        { value: 'semibold', label: 'Semi Bold', class: 'font-semibold' },
        { value: 'bold', label: 'Bold', class: 'font-bold' }
    ];

    const textAlignOptions = [
        { value: 'left', label: 'Left', class: 'text-left' },
        { value: 'center', label: 'Center', class: 'text-center' },
        { value: 'right', label: 'Right', class: 'text-right' }
    ];

    const letterSpacingOptions = [
        { value: 'tight', label: 'Tight', class: 'tracking-tight' },
        { value: 'normal', label: 'Normal', class: 'tracking-normal' },
        { value: 'wide', label: 'Wide', class: 'tracking-wide' }
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    <h3 className="text-lg font-semibold">Edit Name Block</h3>
                </div>
                {onClose && (
                    <Button variant="outline" size="sm" onClick={onClose}>
                        Done
                    </Button>
                )}
            </div>

            {/* Content Settings */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Type className="w-4 h-4" />
                        Content
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name-text">Full Name</Label>
                        <Input
                            id="name-text"
                            value={localProps.text}
                            onChange={(e) => handleChange('text', e.target.value)}
                            placeholder="Enter your full name"
                            className={errors.length > 0 ? 'border-red-500' : ''}
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{localProps.text.length}/100 characters</span>
                            {errors.length > 0 && (
                                <span className="text-red-500">{errors[0]}</span>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Typography Settings */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Palette className="w-4 h-4" />
                        Typography
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Font Size</Label>
                            <Select
                                value={localProps.fontSize}
                                onValueChange={(value) => handleChange('fontSize', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {fontSizeOptions.map(option => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Font Weight</Label>
                            <Select
                                value={localProps.fontWeight}
                                onValueChange={(value) => handleChange('fontWeight', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {fontWeightOptions.map(option => (
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
                            <Label>Text Alignment</Label>
                            <Select
                                value={localProps.textAlign}
                                onValueChange={(value) => handleChange('textAlign', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {textAlignOptions.map(option => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Letter Spacing</Label>
                            <Select
                                value={localProps.letterSpacing}
                                onValueChange={(value) => handleChange('letterSpacing', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {letterSpacingOptions.map(option => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Text Color</Label>
                        <div className="flex gap-2">
                            <Input
                                type="color"
                                value={localProps.color}
                                onChange={(e) => handleChange('color', e.target.value)}
                                className="w-16 h-10 p-1 border rounded"
                            />
                            <Input
                                value={localProps.color}
                                onChange={(e) => handleChange('color', e.target.value)}
                                placeholder="#000000"
                                className="flex-1"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Preview */}
            <Card>
                <CardHeader>
                    <CardTitle>Preview</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="p-4 border rounded-lg bg-muted/20">
                        <h1
                            className={`
                ${fontSizeOptions.find(f => f.value === localProps.fontSize)?.class || 'text-4xl'}
                ${fontWeightOptions.find(f => f.value === localProps.fontWeight)?.class || 'font-bold'}
                ${textAlignOptions.find(f => f.value === localProps.textAlign)?.class || 'text-center'}
                ${letterSpacingOptions.find(f => f.value === localProps.letterSpacing)?.class || 'tracking-normal'}
              `}
                            style={{ color: localProps.color }}
                        >
                            {localProps.text || 'Your Name'}
                        </h1>
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
                                handleChange('fontSize', 'large');
                                handleChange('fontWeight', 'bold');
                                handleChange('textAlign', 'center');
                                handleChange('color', '#000000');
                            }}
                        >
                            Reset to Default
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                handleChange('fontSize', 'xl');
                                handleChange('fontWeight', 'bold');
                                handleChange('letterSpacing', 'wide');
                            }}
                        >
                            Make It Bold
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                handleChange('fontSize', 'medium');
                                handleChange('fontWeight', 'normal');
                                handleChange('textAlign', 'left');
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

export default NameBlockEditor;
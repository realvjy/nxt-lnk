import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TaglineBlockType } from '@/shared/app/blocks';
import { Tag, Type, Eye, Sparkles } from 'lucide-react';

interface TaglineBlockEditorProps {
    block: TaglineBlockType;
    onChange: (block: TaglineBlockType) => void;
    onClose?: () => void;
}

// Fixed interface - no extending from union type
interface ExtendedTaglineProps {
    text: string;
    fontSize?: 'small' | 'medium' | 'large';
    fontWeight?: 'normal' | 'medium' | 'semibold';
    textAlign?: 'left' | 'center' | 'right';
    style?: 'normal' | 'italic' | 'uppercase';
    color?: string;
}

export const TaglineBlockEditor: React.FC<TaglineBlockEditorProps> = ({
    block,
    onChange,
    onClose
}) => {
    const [localProps, setLocalProps] = useState<ExtendedTaglineProps>({
        text: block.content.text,
        fontSize: 'medium',
        fontWeight: 'normal',
        textAlign: 'center',
        style: 'normal',
        color: '#6b7280'
    });

    const [errors, setErrors] = useState<string[]>([]);

    useEffect(() => {
        const newErrors: string[] = [];

        if (localProps.text && localProps.text.length > 200) {
            newErrors.push('Tagline must be less than 200 characters');
        }

        setErrors(newErrors);
    }, [localProps.text]);

    const handleChange = (key: keyof ExtendedTaglineProps, value: any) => {
        const newProps = { ...localProps, [key]: value };
        setLocalProps(newProps);

        onChange({
            ...block,
            content: {
                text: newProps.text
            }
        });
    };

    const taglineTemplates = [
        "Designer & Developer",
        "Creative Problem Solver",
        "Building the future, one pixel at a time",
        "Passionate about [your passion]",
        "Making ideas come to life",
        "Digital creator & storyteller",
        "[Your profession] | [Your location]",
        "Helping businesses grow through [skill]",
        "Coffee enthusiast ☕ | Code lover 💻",
        "Turning dreams into digital reality"
    ];

    const fontSizeOptions = [
        { value: 'small', label: 'Small', class: 'text-sm' },
        { value: 'medium', label: 'Medium', class: 'text-base' },
        { value: 'large', label: 'Large', class: 'text-lg' }
    ];

    const fontWeightOptions = [
        { value: 'normal', label: 'Normal', class: 'font-normal' },
        { value: 'medium', label: 'Medium', class: 'font-medium' },
        { value: 'semibold', label: 'Semi Bold', class: 'font-semibold' }
    ];

    const textAlignOptions = [
        { value: 'left', label: 'Left', class: 'text-left' },
        { value: 'center', label: 'Center', class: 'text-center' },
        { value: 'right', label: 'Right', class: 'text-right' }
    ];

    const styleOptions = [
        { value: 'normal', label: 'Normal', class: '' },
        { value: 'italic', label: 'Italic', class: 'italic' },
        { value: 'uppercase', label: 'Uppercase', class: 'uppercase' }
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Tag className="w-5 h-5" />
                    <h3 className="text-lg font-semibold">Edit Tagline Block</h3>
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
                        <Label htmlFor="tagline-text">Tagline</Label>
                        <Input
                            id="tagline-text"
                            value={localProps.text}
                            onChange={(e) => handleChange('text', e.target.value)}
                            placeholder="What do you do?"
                            className={errors.length > 0 ? 'border-red-500' : ''}
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{localProps.text.length}/200 characters</span>
                            {errors.length > 0 && (
                                <span className="text-red-500">{errors[0]}</span>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Templates</Label>
                        <div className="grid grid-cols-1 gap-1 max-h-40 overflow-y-auto">
                            {taglineTemplates.map((template, index) => (
                                <Button
                                    key={index}
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleChange('text', template)}
                                    className="justify-start h-auto p-2 text-left"
                                >
                                    <div className="text-sm">{template}</div>
                                </Button>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Style Settings */}
            <Card>
                <CardHeader>
                    <CardTitle>Style Settings</CardTitle>
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
                            <Label>Text Style</Label>
                            <Select
                                value={localProps.style}
                                onValueChange={(value) => handleChange('style', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {styleOptions.map(option => (
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
                                placeholder="#6b7280"
                                className="flex-1"
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
                    <div className="p-4 border rounded-lg bg-muted/20">
                        <p
                            className={`
                ${fontSizeOptions.find(f => f.value === localProps.fontSize)?.class || 'text-base'}
                ${fontWeightOptions.find(f => f.value === localProps.fontWeight)?.class || 'font-normal'}
                ${textAlignOptions.find(f => f.value === localProps.textAlign)?.class || 'text-center'}
                ${styleOptions.find(f => f.value === localProps.style)?.class || ''}
                leading-relaxed
              `}
                            style={{ color: localProps.color }}
                        >
                            {localProps.text || 'Your tagline here'}
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        Quick Actions
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                handleChange('fontSize', 'medium');
                                handleChange('fontWeight', 'normal');
                                handleChange('textAlign', 'center');
                                handleChange('style', 'normal');
                                handleChange('color', '#6b7280');
                            }}
                        >
                            Reset Default
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                handleChange('fontSize', 'large');
                                handleChange('fontWeight', 'semibold');
                                handleChange('style', 'normal');
                            }}
                        >
                            Make Bold
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                handleChange('fontSize', 'medium');
                                handleChange('fontWeight', 'normal');
                                handleChange('style', 'italic');
                            }}
                        >
                            Make Elegant
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                handleChange('style', 'uppercase');
                                handleChange('fontWeight', 'semibold');
                                handleChange('fontSize', 'small');
                            }}
                        >
                            Make Modern
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default TaglineBlockEditor;
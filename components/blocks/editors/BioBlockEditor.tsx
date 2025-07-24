// components/blocks/editors/BioBlockEditor.tsx - Fixed version
import React, { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { BioBlockType } from '@/shared/blocks';
import {
    Type,
    Eye,
    AlignLeft,
    AlignCenter,
    AlignRight,
    Bold,
    Italic,
    Link2,
    List,
    Sparkles
} from 'lucide-react';

interface BioBlockEditorProps {
    block: BioBlockType;
    onChange: (block: BioBlockType) => void;
    onClose?: () => void;
}

// Fixed interface - no extending from union type
interface ExtendedBioProps {
    text: string;
    textAlign?: 'left' | 'center' | 'right';
    fontSize?: 'small' | 'medium' | 'large';
    lineHeight?: 'tight' | 'normal' | 'relaxed';
    maxLength?: number;
}

export const BioBlockEditor: React.FC<BioBlockEditorProps> = ({
    block,
    onChange,
    onClose
}) => {
    const [localProps, setLocalProps] = useState<ExtendedBioProps>({
        text: block.props.text,
        textAlign: 'center',
        fontSize: 'medium',
        lineHeight: 'relaxed',
        maxLength: 500
    });

    const [errors, setErrors] = useState<string[]>([]);
    const [wordCount, setWordCount] = useState(0);
    const [characterCount, setCharacterCount] = useState(0);

    // Count words and characters
    useEffect(() => {
        const text = localProps.text || '';
        setCharacterCount(text.length);
        setWordCount(text.trim() ? text.trim().split(/\s+/).length : 0);
    }, [localProps.text]);

    // Validate on change
    useEffect(() => {
        const newErrors: string[] = [];

        if (localProps.text && localProps.text.length > (localProps.maxLength || 500)) {
            newErrors.push(`Bio must be less than ${localProps.maxLength || 500} characters`);
        }

        setErrors(newErrors);
    }, [localProps.text, localProps.maxLength]);

    const handleChange = (key: keyof ExtendedBioProps, value: any) => {
        const newProps = { ...localProps, [key]: value };
        setLocalProps(newProps);

        // Update the block with basic props
        onChange({
            ...block,
            props: {
                text: newProps.text
            }
        });
    };

    const insertFormatting = (before: string, after: string = '') => {
        const textarea = document.getElementById('bio-text') as HTMLTextAreaElement;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = localProps.text.substring(start, end);

        const newText =
            localProps.text.substring(0, start) +
            before + selectedText + after +
            localProps.text.substring(end);

        handleChange('text', newText);

        // Reset cursor position
        setTimeout(() => {
            textarea.focus();
            textarea.selectionStart = start + before.length;
            textarea.selectionEnd = start + before.length + selectedText.length;
        }, 0);
    };

    const bioTemplates = [
        {
            name: 'Professional',
            template: 'Passionate [profession] with [X] years of experience in [industry]. I specialize in [specialization] and love creating [what you create]. Currently working at [company].'
        },
        {
            name: 'Creative',
            template: '✨ [Creative role] & [secondary role] ✨\n🎨 Creating [what you create]\n📍 Based in [location]\n💫 [fun fact or motto]'
        },
        {
            name: 'Entrepreneur',
            template: 'Founder of [company] • [Industry] enthusiast • Helping [target audience] achieve [goal] • [Personal interest] in my free time'
        },
        {
            name: 'Simple',
            template: '[Your role] passionate about [interests]. I share insights about [topics] and [activities].'
        }
    ];

    const quickActions = [
        { name: 'Bold', action: () => insertFormatting('<strong>', '</strong>'), icon: Bold },
        { name: 'Italic', action: () => insertFormatting('<em>', '</em>'), icon: Italic },
        { name: 'Link', action: () => insertFormatting('<a href="https://example.com">', '</a>'), icon: Link2 },
    ];

    const alignmentOptions = [
        { value: 'left', label: 'Left', icon: AlignLeft },
        { value: 'center', label: 'Center', icon: AlignCenter },
        { value: 'right', label: 'Right', icon: AlignRight }
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Type className="w-5 h-5" />
                    <h3 className="text-lg font-semibold">Edit Bio Block</h3>
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
                    <CardTitle>Content</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Quick Formatting Toolbar */}
                    <div className="flex items-center gap-1 p-2 border rounded-lg bg-muted/20">
                        {quickActions.map(({ name, action, icon: Icon }) => (
                            <Button
                                key={name}
                                variant="ghost"
                                size="sm"
                                onClick={action}
                                className="h-8 w-8 p-0"
                                title={name}
                            >
                                <Icon className="w-4 h-4" />
                            </Button>
                        ))}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="bio-text">Bio Text</Label>
                        <Textarea
                            id="bio-text"
                            value={localProps.text}
                            onChange={(e) => handleChange('text', e.target.value)}
                            placeholder="Tell people about yourself..."
                            rows={6}
                            className={`resize-none ${errors.length > 0 ? 'border-red-500' : ''}`}
                        />

                        <div className="flex justify-between items-center text-xs text-muted-foreground">
                            <div className="flex gap-4">
                                <span>{characterCount}/{localProps.maxLength || 500} characters</span>
                                <span>{wordCount} words</span>
                            </div>
                            {errors.length > 0 && (
                                <span className="text-red-500">{errors[0]}</span>
                            )}
                        </div>
                    </div>

                    {/* Bio Templates */}
                    <div className="space-y-2">
                        <Label>Templates</Label>
                        <div className="grid grid-cols-2 gap-2">
                            {bioTemplates.map((template) => (
                                <Button
                                    key={template.name}
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleChange('text', template.template)}
                                    className="h-auto p-2 text-left"
                                >
                                    <div>
                                        <div className="font-medium text-xs">{template.name}</div>
                                        <div className="text-xs text-muted-foreground truncate">
                                            {template.template.substring(0, 40)}...
                                        </div>
                                    </div>
                                </Button>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Style Settings */}
            <Card>
                <CardHeader>
                    <CardTitle>Style</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
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
                                    {alignmentOptions.map(({ value, label, icon: Icon }) => (
                                        <SelectItem key={value} value={value}>
                                            <div className="flex items-center gap-2">
                                                <Icon className="w-4 h-4" />
                                                {label}
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

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
                                    <SelectItem value="small">Small</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="large">Large</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Line Height</Label>
                            <Select
                                value={localProps.lineHeight}
                                onValueChange={(value) => handleChange('lineHeight', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="tight">Tight</SelectItem>
                                    <SelectItem value="normal">Normal</SelectItem>
                                    <SelectItem value="relaxed">Relaxed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Character Limit</Label>
                        <Select
                            value={localProps.maxLength?.toString() || '500'}
                            onValueChange={(value) => handleChange('maxLength', parseInt(value))}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="200">200 characters (Twitter-like)</SelectItem>
                                <SelectItem value="500">500 characters (Standard)</SelectItem>
                                <SelectItem value="1000">1000 characters (Extended)</SelectItem>
                                <SelectItem value="2000">2000 characters (Long form)</SelectItem>
                            </SelectContent>
                        </Select>
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
                        <div
                            className={`
                ${localProps.textAlign === 'left' ? 'text-left' : ''}
                ${localProps.textAlign === 'center' ? 'text-center' : ''}
                ${localProps.textAlign === 'right' ? 'text-right' : ''}
                ${localProps.fontSize === 'small' ? 'text-sm' : ''}
                ${localProps.fontSize === 'medium' ? 'text-base' : ''}
                ${localProps.fontSize === 'large' ? 'text-lg' : ''}
                ${localProps.lineHeight === 'tight' ? 'leading-tight' : ''}
                ${localProps.lineHeight === 'normal' ? 'leading-normal' : ''}
                ${localProps.lineHeight === 'relaxed' ? 'leading-relaxed' : ''}
                prose prose-sm max-w-none text-muted-foreground
              `}
                            dangerouslySetInnerHTML={{
                                __html: localProps.text || 'Your bio will appear here...'
                            }}
                        />
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
                                handleChange('textAlign', 'center');
                                handleChange('fontSize', 'medium');
                                handleChange('lineHeight', 'relaxed');
                            }}
                        >
                            Center Style
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                handleChange('textAlign', 'left');
                                handleChange('fontSize', 'small');
                                handleChange('lineHeight', 'normal');
                            }}
                        >
                            Compact Style
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                handleChange('textAlign', 'center');
                                handleChange('fontSize', 'large');
                                handleChange('lineHeight', 'relaxed');
                            }}
                        >
                            Emphasis Style
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleChange('text', '')}
                        >
                            Clear Text
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default BioBlockEditor;
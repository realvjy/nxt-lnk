import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TaglineBlockType } from '@/types/app/blocks';
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
            Tagline Block Editor
        </div>
    );
};

export default TaglineBlockEditor;
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
            Name Block Editor
        </div>
    );
};

export default NameBlockEditor;
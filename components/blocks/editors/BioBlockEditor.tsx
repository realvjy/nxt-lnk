import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { BioBlockType } from '@/types/app/blocks';
import {
    Type,
    Eye,
    AlignLeft,
    AlignCenter,
    AlignRight,
    Bold,
    Italic,
    Underline as UnderlineIcon,
    Strikethrough,
    Link2,
    List,
    ListOrdered,
    Quote,
    Code,
    Sparkles,
    Palette,
    RotateCcw,
    Hash,
    Minus
} from 'lucide-react';

// Tiptap imports
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TiptapUnderline from '@tiptap/extension-underline';
import TiptapLink from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import CharacterCount from '@tiptap/extension-character-count';

interface BioBlockEditorProps {
    block: BioBlockType;
    onChange: (block: BioBlockType) => void;
    onClose?: () => void;
}

// Extended props for styling
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
        text: block.content.text,
        textAlign: 'center',
        fontSize: 'medium',
        lineHeight: 'relaxed',
        maxLength: 500
    });

    // Bio templates with proper HTML
    const bioTemplates = [
        {
            name: 'Professional',
            template: '<p>Passionate <strong>developer</strong> with <em>5+ years</em> of experience in web technologies. I specialize in <strong>React</strong> and <strong>TypeScript</strong>, creating user-friendly applications that make a difference.</p>'
        },
        {
            name: 'Creative',
            template: '<p style="text-align: center">✨ <strong>Creative Designer</strong> &amp; <em>Developer</em> ✨<br>🎨 Creating beautiful digital experiences<br>📍 Based in <strong>San Francisco</strong><br>💫 Always learning something new</p>'
        },
        {
            name: 'Entrepreneur',
            template: '<p><strong>Founder</strong> of <a target="_blank" rel="noopener noreferrer" href="#">StartupCo</a> • <em>Tech enthusiast</em> • Helping businesses grow through <strong>innovative solutions</strong> • Coffee lover ☕ in my free time</p>'
        },
        {
            name: 'Simple',
            template: '<p><strong>Software Engineer</strong> passionate about <em>clean code</em> and <strong>user experience</strong>. I share insights about <a target="_blank" rel="noopener noreferrer" href="#">web development</a> and modern technologies.</p>'
        }
    ];


    return (
        <div className="space-y-6">
            {/* Header */}
            Bio Editor
        </div>
    );
};

export default BioBlockEditor;
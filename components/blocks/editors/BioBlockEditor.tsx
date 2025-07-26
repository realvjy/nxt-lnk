import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { BioBlockType } from '@/shared/app/blocks';
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

    const [errors, setErrors] = useState<string[]>([]);
    const [showLinkDialog, setShowLinkDialog] = useState(false);
    const [linkUrl, setLinkUrl] = useState('');

    // Initialize Tiptap editor
    const editor = useEditor({
        immediatelyRender: false, // Fix for Next.js SSR
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3, 4],
                },
            }),
            TiptapUnderline,
            TiptapLink.configure({
                openOnClick: false,
                HTMLAttributes: {
                    target: '_blank',
                    rel: 'noopener noreferrer',
                },
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Placeholder.configure({
                placeholder: 'Tell people about yourself...',
            }),
            CharacterCount.configure({
                limit: localProps.maxLength,
            }),
        ],
        content: localProps.text,
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            setLocalProps(prev => ({ ...prev, text: html }));
            onChange({
                ...block,
                content: { text: html }
            });
        },
        editorProps: {
            attributes: {
                class: 'tiptap-editor-content focus:outline-none',
            },
        },
    });

    // Update editor content when block changes
    useEffect(() => {
        if (editor && editor.getHTML() !== block.content.text) {
            editor.commands.setContent(block.content.text);
        }
    }, [block.content.text, editor]);

    // Validate character count
    useEffect(() => {
        const newErrors: string[] = [];
        const characterCount = editor?.storage.characterCount.characters() || 0;

        if (characterCount > (localProps.maxLength || 500)) {
            newErrors.push(`Bio must be less than ${localProps.maxLength || 500} characters`);
        }

        setErrors(newErrors);
    }, [editor?.storage.characterCount.characters(), localProps.maxLength]);

    const handleChange = (key: keyof ExtendedBioProps, value: any) => {
        const newProps = { ...localProps, [key]: value };
        setLocalProps(newProps);

        // Apply text alignment to editor
        if (key === 'textAlign' && editor) {
            editor.chain().focus().setTextAlign(value).run();
        }
    };

    // Toolbar actions
    const toggleBold = () => editor?.chain().focus().toggleBold().run();
    const toggleItalic = () => editor?.chain().focus().toggleItalic().run();
    const toggleUnderline = () => editor?.chain().focus().toggleUnderline().run();
    const toggleStrike = () => editor?.chain().focus().toggleStrike().run();
    const toggleCode = () => editor?.chain().focus().toggleCode().run();
    const toggleBlockquote = () => editor?.chain().focus().toggleBlockquote().run();
    const toggleBulletList = () => editor?.chain().focus().toggleBulletList().run();
    const toggleOrderedList = () => editor?.chain().focus().toggleOrderedList().run();
    const insertHorizontalRule = () => editor?.chain().focus().setHorizontalRule().run();

    const setHeading = (level: number) => {
        if (level === 0) {
            editor?.chain().focus().setParagraph().run();
        } else {
            editor?.chain().focus().toggleHeading({ level: level as 1 | 2 | 3 | 4 }).run();
        }
    };

    const setLink = () => {
        if (!linkUrl) return;

        editor?.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run();
        setLinkUrl('');
        setShowLinkDialog(false);
    };

    const unsetLink = () => {
        editor?.chain().focus().unsetLink().run();
    };

    const clearFormatting = () => {
        editor?.chain().focus().clearNodes().unsetAllMarks().run();
    };

    // Check if buttons should be active
    const isActive = (name: string, attrs?: any) => {
        return editor?.isActive(name, attrs) || false;
    };

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

    const applyTemplate = (template: string) => {
        editor?.commands.setContent(template);
    };

    const characterCount = editor?.storage.characterCount.characters() || 0;
    const wordCount = editor?.storage.characterCount.words() || 0;

    if (!editor) {
        return <div>Loading editor...</div>;
    }

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
                    <CardTitle>Rich Text Editor</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Formatting Toolbar */}
                    <div className="border rounded-lg p-2 bg-muted/20">
                        <div className="flex items-center gap-1 flex-wrap">
                            {/* Heading Selector */}
                            <Select onValueChange={(value) => setHeading(parseInt(value))}>
                                <SelectTrigger className="w-24 h-8">
                                    <SelectValue placeholder="Text" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="0">Text</SelectItem>
                                    <SelectItem value="1">H1</SelectItem>
                                    <SelectItem value="2">H2</SelectItem>
                                    <SelectItem value="3">H3</SelectItem>
                                    <SelectItem value="4">H4</SelectItem>
                                </SelectContent>
                            </Select>

                            <Separator orientation="vertical" className="h-6" />

                            {/* Text Formatting */}
                            <Button
                                variant={isActive('bold') ? 'default' : 'ghost'}
                                size="sm"
                                onClick={toggleBold}
                                className="h-8 w-8 p-0"
                                title="Bold (Ctrl+B)"
                            >
                                <Bold className="w-4 h-4" />
                            </Button>
                            <Button
                                variant={isActive('italic') ? 'default' : 'ghost'}
                                size="sm"
                                onClick={toggleItalic}
                                className="h-8 w-8 p-0"
                                title="Italic (Ctrl+I)"
                            >
                                <Italic className="w-4 h-4" />
                            </Button>
                            <Button
                                variant={isActive('underline') ? 'default' : 'ghost'}
                                size="sm"
                                onClick={toggleUnderline}
                                className="h-8 w-8 p-0"
                                title="Underline (Ctrl+U)"
                            >
                                <UnderlineIcon className="w-4 h-4" />
                            </Button>
                            <Button
                                variant={isActive('strike') ? 'default' : 'ghost'}
                                size="sm"
                                onClick={toggleStrike}
                                className="h-8 w-8 p-0"
                                title="Strikethrough"
                            >
                                <Strikethrough className="w-4 h-4" />
                            </Button>
                            <Button
                                variant={isActive('code') ? 'default' : 'ghost'}
                                size="sm"
                                onClick={toggleCode}
                                className="h-8 w-8 p-0"
                                title="Inline Code"
                            >
                                <Code className="w-4 h-4" />
                            </Button>

                            <Separator orientation="vertical" className="h-6" />

                            {/* Alignment */}
                            <Button
                                variant={isActive('paragraph', { textAlign: 'left' }) || isActive('heading', { textAlign: 'left' }) ? 'default' : 'ghost'}
                                size="sm"
                                onClick={() => editor.chain().focus().setTextAlign('left').run()}
                                className="h-8 w-8 p-0"
                                title="Align Left"
                            >
                                <AlignLeft className="w-4 h-4" />
                            </Button>
                            <Button
                                variant={isActive('paragraph', { textAlign: 'center' }) || isActive('heading', { textAlign: 'center' }) ? 'default' : 'ghost'}
                                size="sm"
                                onClick={() => editor.chain().focus().setTextAlign('center').run()}
                                className="h-8 w-8 p-0"
                                title="Align Center"
                            >
                                <AlignCenter className="w-4 h-4" />
                            </Button>
                            <Button
                                variant={isActive('paragraph', { textAlign: 'right' }) || isActive('heading', { textAlign: 'right' }) ? 'default' : 'ghost'}
                                size="sm"
                                onClick={() => editor.chain().focus().setTextAlign('right').run()}
                                className="h-8 w-8 p-0"
                                title="Align Right"
                            >
                                <AlignRight className="w-4 h-4" />
                            </Button>

                            <Separator orientation="vertical" className="h-6" />

                            {/* Lists and Block Elements */}
                            <Button
                                variant={isActive('bulletList') ? 'default' : 'ghost'}
                                size="sm"
                                onClick={toggleBulletList}
                                className="h-8 w-8 p-0"
                                title="Bullet List"
                            >
                                <List className="w-4 h-4" />
                            </Button>
                            <Button
                                variant={isActive('orderedList') ? 'default' : 'ghost'}
                                size="sm"
                                onClick={toggleOrderedList}
                                className="h-8 w-8 p-0"
                                title="Numbered List"
                            >
                                <ListOrdered className="w-4 h-4" />
                            </Button>
                            <Button
                                variant={isActive('blockquote') ? 'default' : 'ghost'}
                                size="sm"
                                onClick={toggleBlockquote}
                                className="h-8 w-8 p-0"
                                title="Quote"
                            >
                                <Quote className="w-4 h-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={insertHorizontalRule}
                                className="h-8 w-8 p-0"
                                title="Horizontal Rule"
                            >
                                <Minus className="w-4 h-4" />
                            </Button>

                            <Separator orientation="vertical" className="h-6" />

                            {/* Link */}
                            <Button
                                variant={isActive('link') ? 'default' : 'ghost'}
                                size="sm"
                                onClick={() => {
                                    if (isActive('link')) {
                                        unsetLink();
                                    } else {
                                        setShowLinkDialog(true);
                                    }
                                }}
                                className="h-8 w-8 p-0"
                                title="Link (Ctrl+K)"
                            >
                                <Link2 className="w-4 h-4" />
                            </Button>

                            <Separator orientation="vertical" className="h-6" />

                            {/* Clear Formatting */}
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={clearFormatting}
                                className="h-8 w-8 p-0"
                                title="Clear Formatting"
                            >
                                <RotateCcw className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Editor */}
                    <div className="tiptap-editor border rounded-lg min-h-[120px] focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                        <EditorContent
                            editor={editor}
                            className="prose prose-sm max-w-none"
                        />
                    </div>

                    {/* Character Count */}
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <div className="flex gap-4">
                            <span>{characterCount}/{localProps.maxLength || 500} characters</span>
                            <span>{wordCount} words</span>
                        </div>
                        {errors.length > 0 && (
                            <span className="text-red-500">{errors[0]}</span>
                        )}
                    </div>

                    {/* Bio Templates */}
                    <div className="space-y-2">
                        <Label>Templates</Label>
                        <div className="grid grid-cols-2 gap-2">
                            {bioTemplates.map((template, index) => (
                                <Button
                                    key={index}
                                    variant="outline"
                                    size="sm"
                                    onClick={() => applyTemplate(template.template)}
                                    className="justify-start h-auto p-3 text-left"
                                >
                                    <div>
                                        <div className="font-medium text-xs mb-1">{template.name}</div>
                                        <div className="text-xs text-muted-foreground line-clamp-2">
                                            {template.template.replace(/<[^>]*>/g, '').substring(0, 50)}...
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
                    <CardTitle className="flex items-center gap-2">
                        <Palette className="w-4 h-4" />
                        Additional Settings
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
                            onValueChange={(value) => {
                                const newLimit = parseInt(value);
                                handleChange('maxLength', newLimit);

                                // Properly update the character count extension
                                const characterCountExtension = editor?.extensionManager.extensions.find(ext => ext.name === 'characterCount');
                                if (characterCountExtension) {
                                    characterCountExtension.options.limit = newLimit;
                                    // Force the editor to re-evaluate the character count
                                    editor?.view.dispatch(editor.state.tr);
                                }
                            }}
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

            {/* Link Dialog */}
            {showLinkDialog && (
                <Card className="border-primary">
                    <CardHeader>
                        <CardTitle className="text-sm flex items-center gap-2">
                            <Link2 className="w-4 h-4" />
                            Insert Link
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="space-y-2">
                            <Label htmlFor="link-url">URL</Label>
                            <Input
                                id="link-url"
                                value={linkUrl}
                                onChange={(e) => setLinkUrl(e.target.value)}
                                placeholder="https://example.com"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        setLink();
                                    }
                                }}
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button size="sm" onClick={setLink} disabled={!linkUrl}>
                                Insert Link
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => setShowLinkDialog(false)}>
                                Cancel
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

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
                                editor.chain().focus().setTextAlign('center').run();
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
                                editor.chain().focus().setTextAlign('left').run();
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
                                editor.chain().focus().setTextAlign('center').run();
                                handleChange('fontSize', 'large');
                                handleChange('lineHeight', 'relaxed');
                            }}
                        >
                            Emphasis Style
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => editor.commands.clearContent()}
                        >
                            Clear All
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default BioBlockEditor;
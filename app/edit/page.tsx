// app/edit/page.tsx - Profile Builder Edit Interface (Fixed)
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { BlockRenderer } from '@/components/blocks/BlockRenderer';
import {
    NameBlockEditor,
    TaglineBlockEditor,
    BioBlockEditor,
    BadgeBlockEditor,
    ImageBlockEditor,
    LinkBlockEditor
} from '@/components/blocks/editors';
import {
    User,
    Link2,
    Type,
    Image,
    Tag,
    Shield,
    Edit,
    Eye,
    Save,
    Settings,
    Plus,
    Smartphone,
    Tablet,
    Monitor,
    ExternalLink,
    ArrowLeft
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/lib/stores/userStore';
import { useLayoutStore } from '@/lib/stores/layoutStore';
import { usePersistenceStore } from '@/lib/stores/persistenceStore';
import { createBlock } from '@/shared/blocks';
import type {
    Block,
    NameBlockType,
    TaglineBlockType,
    BioBlockType,
    ImageBlockType,
    BadgeBlockType,
    LinkBlockType
} from '@/shared/blocks';

const EditPage: React.FC = () => {
    const router = useRouter();
    const { username, setUsername } = useUserStore();
    const { layout, setLayout, addBlock: addBlockToLayout } = useLayoutStore();
    const { saveToStorage } = usePersistenceStore();

    const [blocks, setBlocks] = useState<Block[]>(layout);
    const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(true);
    const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
    const [isSaving, setIsSaving] = useState(false);
    const [usernameInput, setUsernameInput] = useState(username || '');
    const [usernameError, setUsernameError] = useState('');

    // Sync blocks with layout store
    useEffect(() => {
        setBlocks(layout);
    }, [layout]);

    // Initialize data from localStorage
    useEffect(() => {
        const initializeData = async () => {
            // If we already have a username, load data for that username
            if (username) {
                try {
                    // This will load layout from localStorage for the current username
                    await usePersistenceStore.getState().loadFromStorage(username);
                } catch (error) {
                    console.error('Failed to load data:', error);
                }
            }
        };

        initializeData();
    }, [username]);

    // Block management functions
    const handleAddBlock = (type: Block['type']) => {
        const newBlock = createBlock(type);
        const updatedBlocks = [...blocks, newBlock];
        setBlocks(updatedBlocks);
        setLayout(updatedBlocks);
        setSelectedBlockId(newBlock.id);
    };

    const handleUpdateBlock = (updatedBlock: Block) => {
        const updatedBlocks = blocks.map(block =>
            block.id === updatedBlock.id ? updatedBlock : block
        );
        setBlocks(updatedBlocks);
        setLayout(updatedBlocks);
    };

    const handleDeleteBlock = (blockId: string) => {
        const updatedBlocks = blocks.filter(block => block.id !== blockId);
        setBlocks(updatedBlocks);
        setLayout(updatedBlocks);
        if (selectedBlockId === blockId) {
            setSelectedBlockId(null);
        }
    };

    const handleDuplicateBlock = (blockId: string) => {
        const blockToDuplicate = blocks.find(b => b.id === blockId);
        if (blockToDuplicate) {
            const duplicatedBlock = createBlock(blockToDuplicate.type, blockToDuplicate.props);
            const blockIndex = blocks.findIndex(b => b.id === blockId);
            const updatedBlocks = [
                ...blocks.slice(0, blockIndex + 1),
                duplicatedBlock,
                ...blocks.slice(blockIndex + 1)
            ];
            setBlocks(updatedBlocks);
            setLayout(updatedBlocks);
        }
    };

    // Handle username change
    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.trim().toLowerCase();
        setUsernameInput(value);

        // Basic validation
        if (!value) {
            setUsernameError('Username is required');
        } else if (!/^[a-z0-9_-]+$/.test(value)) {
            setUsernameError('Username can only contain lowercase letters, numbers, underscores, and hyphens');
        } else {
            setUsernameError('');
        }
    };

    // Apply username change
    const applyUsername = () => {
        if (!usernameInput || usernameError) return;
        setUsername(usernameInput);
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            // Apply username if valid
            if (!username && usernameInput && !usernameError) {
                setUsername(usernameInput);
            }

            // Check if username exists
            if (!username && !usernameInput) {
                throw new Error('Please set a username before saving');
            }

            await saveToStorage();
            // Show success message or toast
            console.log('Profile saved successfully!');
        } catch (error) {
            console.error('Failed to save profile:', error);
            // Show error message or toast
        } finally {
            setIsSaving(false);
        }
    };

    const handlePreview = () => {
        // Apply username if valid
        if (!username && usernameInput && !usernameError) {
            setUsername(usernameInput);
        }

        if (username) {
            router.push(`/${username}`);
        } else {
            // Show error or alert that username is required
            console.error('Username is required to preview profile');
        }
    };

    // Available block types
    const blockTypes = [
        { type: 'name', label: 'Name', icon: User, description: 'Add your full name' },
        { type: 'tagline', label: 'Tagline', icon: Tag, description: 'Add a tagline or title' },
        { type: 'bio', label: 'Bio', icon: Type, description: 'Add a bio or description' },
        { type: 'image', label: 'Image', icon: Image, description: 'Add profile image' },
        { type: 'badge', label: 'Badge', icon: Shield, description: 'Add status badge' },
        { type: 'link', label: 'Link', icon: Link2, description: 'Add a link' },
    ];

    // Render editor based on selected block with proper typing
    const renderEditor = () => {
        const selectedBlock = blocks.find(b => b.id === selectedBlockId);
        if (!selectedBlock) return null;

        // Create type-safe update handler for each block type
        const createUpdateHandler = <T extends Block>(blockType: T['type']) => {
            return (updatedBlock: T) => {
                handleUpdateBlock(updatedBlock);
            };
        };

        const onClose = () => setSelectedBlockId(null);

        switch (selectedBlock.type) {
            case 'name':
                return (
                    <NameBlockEditor
                        block={selectedBlock as NameBlockType}
                        onChange={createUpdateHandler<NameBlockType>('name')}
                        onClose={onClose}
                    />
                );
            case 'tagline':
                return (
                    <TaglineBlockEditor
                        block={selectedBlock as TaglineBlockType}
                        onChange={createUpdateHandler<TaglineBlockType>('tagline')}
                        onClose={onClose}
                    />
                );
            case 'bio':
                return (
                    <BioBlockEditor
                        block={selectedBlock as BioBlockType}
                        onChange={createUpdateHandler<BioBlockType>('bio')}
                        onClose={onClose}
                    />
                );
            case 'image':
                return (
                    <ImageBlockEditor
                        block={selectedBlock as ImageBlockType}
                        onChange={createUpdateHandler<ImageBlockType>('image')}
                        onClose={onClose}
                    />
                );
            case 'badge':
                return (
                    <BadgeBlockEditor
                        block={selectedBlock as BadgeBlockType}
                        onChange={createUpdateHandler<BadgeBlockType>('badge')}
                        onClose={onClose}
                    />
                );
            case 'link':
                return (
                    <LinkBlockEditor
                        block={selectedBlock as LinkBlockType}
                        onChange={createUpdateHandler<LinkBlockType>('link')}
                        onClose={onClose}
                    />
                );
            default:
                return (
                    <div className="p-4 text-center text-muted-foreground">
                        <p>No editor available for this block type</p>
                    </div>
                );
        }
    };

    const previewSizes = {
        desktop: 'max-w-4xl',
        tablet: 'max-w-2xl',
        mobile: 'max-w-sm'
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => router.back()}
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back
                            </Button>
                            <Separator orientation="vertical" className="h-6" />
                            <div>
                                <h1 className="text-xl font-semibold">Profile Builder</h1>
                                <p className="text-sm text-muted-foreground">
                                    {username ? `Editing ${username}'s profile` : 'Create your profile'}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            {/* Preview Mode Toggle */}
                            {!isEditing && (
                                <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
                                    <Button
                                        variant={previewMode === 'desktop' ? 'default' : 'ghost'}
                                        size="sm"
                                        onClick={() => setPreviewMode('desktop')}
                                    >
                                        <Monitor className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant={previewMode === 'tablet' ? 'default' : 'ghost'}
                                        size="sm"
                                        onClick={() => setPreviewMode('tablet')}
                                    >
                                        <Tablet className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant={previewMode === 'mobile' ? 'default' : 'ghost'}
                                        size="sm"
                                        onClick={() => setPreviewMode('mobile')}
                                    >
                                        <Smartphone className="w-4 h-4" />
                                    </Button>
                                </div>
                            )}

                            {/* Edit/Preview Toggle */}
                            <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
                                <Button
                                    variant={isEditing ? 'default' : 'ghost'}
                                    size="sm"
                                    onClick={() => setIsEditing(true)}
                                >
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit
                                </Button>
                                <Button
                                    variant={!isEditing ? 'default' : 'ghost'}
                                    size="sm"
                                    onClick={() => setIsEditing(false)}
                                >
                                    <Eye className="w-4 h-4 mr-2" />
                                    Preview
                                </Button>
                            </div>

                            <Separator orientation="vertical" className="h-6" />

                            {/* Action Buttons */}
                            <Button
                                variant="outline"
                                onClick={handlePreview}
                                disabled={!username}
                            >
                                <ExternalLink className="w-4 h-4 mr-2" />
                                View Live
                            </Button>

                            <Button
                                onClick={handleSave}
                                disabled={isSaving}
                            >
                                <Save className="w-4 h-4 mr-2" />
                                {isSaving ? 'Saving...' : 'Save'}
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Block Library Sidebar */}
                    {isEditing && (
                        <div className="lg:col-span-3">
                            <Card className="sticky top-24">
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Settings className="w-4 h-4" />
                                        <h3 className="font-semibold">Add Blocks</h3>
                                    </div>

                                    <div className="space-y-2">
                                        {blockTypes.map(({ type, label, icon: Icon, description }) => (
                                            <Button
                                                key={type}
                                                variant="outline"
                                                className="w-full justify-start h-auto p-3"
                                                onClick={() => handleAddBlock(type as Block['type'])}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <Icon className="w-5 h-5 text-muted-foreground" />
                                                    <div className="text-left">
                                                        <div className="font-medium">{label}</div>
                                                        <div className="text-xs text-muted-foreground">
                                                            {description}
                                                        </div>
                                                    </div>
                                                </div>
                                            </Button>
                                        ))}
                                    </div>

                                    {blocks.length > 0 && (
                                        <>
                                            <Separator className="my-4" />
                                            <div className="text-sm text-muted-foreground">
                                                <div className="flex items-center justify-between">
                                                    <span>Total Blocks:</span>
                                                    <Badge variant="secondary">{blocks.length}</Badge>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Main Canvas */}
                    <div className={`${isEditing ? 'lg:col-span-6' : 'lg:col-span-9'}`}>
                        <div className={`mx-auto transition-all duration-300 ${previewSizes[previewMode]}`}>
                            {blocks.length === 0 ? (
                                <Card>
                                    <CardContent className="flex flex-col items-center justify-center py-12">
                                        <div className="text-center space-y-4">
                                            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                                                <Plus className="w-8 h-8 text-muted-foreground" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold mb-2">
                                                    Start Building Your Profile
                                                </h3>
                                                <p className="text-muted-foreground mb-4">
                                                    Add blocks from the sidebar to create your profile page.
                                                </p>
                                                {isEditing && (
                                                    <Button onClick={() => handleAddBlock('name')}>
                                                        <User className="w-4 h-4 mr-2" />
                                                        Add Name Block
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ) : (
                                <div className="space-y-4">
                                    {blocks.map((block) => (
                                        <BlockRenderer
                                            key={block.id}
                                            block={block}
                                            isEditing={isEditing}
                                            isSelected={selectedBlockId === block.id}
                                            onUpdate={handleUpdateBlock}
                                            onDelete={handleDeleteBlock}
                                            onDuplicate={handleDuplicateBlock}
                                            onSelect={setSelectedBlockId}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Editor Panel */}
                    {isEditing && selectedBlockId && (
                        <div className="lg:col-span-3">
                            <Card className="sticky top-24">
                                <CardContent className="p-4">
                                    {renderEditor()}
                                </CardContent>
                            </Card>
                        </div>
                    )}
                    {/* Username Input */}
                    {isEditing && (
                        <div className="lg:col-span-3">
                            <Card className="sticky top-24">
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Settings className="w-4 h-4" />
                                        <h3 className="font-semibold">Settings</h3>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex flex-col gap-2">
                                            <label className="text-sm text-muted-foreground" htmlFor="username">Username:</label>
                                            <input
                                                id="username"
                                                type="text"
                                                value={usernameInput}
                                                onChange={handleUsernameChange}
                                                className="w-full p-2 rounded-lg border border-muted"
                                            />
                                            {usernameError && (
                                                <p className="text-xs text-error">{usernameError}</p>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EditPage;
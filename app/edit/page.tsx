'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
    ArrowLeft,
    Undo,
    Redo,
    MousePointer
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
import { DragDropCanvas } from '@/components/blocks/DragDropCanvas';
import Navbar from '@/components/layout/Navbar';

// Drag and Drop imports
import {
    DndContext,
    DragEndEvent,
    DragStartEvent,
    DragOverlay,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    defaultDropAnimationSideEffects,
    DropAnimation,
} from '@dnd-kit/core';
import {
    SortableContext,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';

import { useSupabase } from '@/components/providers/SupabaseProvider';

const dropAnimationConfig: DropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
        styles: {
            active: {
                opacity: '0.4',
            },
        },
    }),
};

const EditPage: React.FC = () => {
    const router = useRouter();
    const { supabase, logout } = useSupabase();
    const { username, setUsername, getStoredUsername } = useUserStore();
    const {
        layout,
        setLayout,
        reorderBlocks,
        addBlock: addBlockToLayout,
        updateBlock: updateBlockInLayout,
        deleteBlock: deleteBlockFromLayout,
        duplicateBlock: duplicateBlockInLayout,
        loadLayout,
        undo,
        redo,
        canUndo,
        canRedo
    } = useLayoutStore();
    const { saveToStorage, loadFromStorage, migrateUsername } = usePersistenceStore();

    const [blocks, setBlocks] = useState<Block[]>(layout);
    const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(true);
    const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
    const [isSaving, setIsSaving] = useState(false);
    const [usernameInput, setUsernameInput] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<any>(null);

    // Drag and drop state
    const [activeBlock, setActiveBlock] = useState<Block | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    // Configure sensors for drag and drop
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8, // 8px movement required to start drag
            },
        }),
        useSensor(KeyboardSensor)
    );

    // Sync blocks with layout store
    useEffect(() => {
        setBlocks(layout);
    }, [layout]);

    // Initialize data and username from localStorage
    useEffect(() => {
        const initializeData = async () => {
            // First, try to get stored username
            const storedUsername = getStoredUsername();

            if (storedUsername) {
                // If we have a stored username, set it and load data
                setUsernameInput(storedUsername);
                try {
                    await loadFromStorage(storedUsername);
                } catch (error) {
                    console.error('Failed to load data:', error);
                }
            } else {
                // If no stored username, just initialize empty
                setUsernameInput('');
            }
        };

        initializeData();
    }, []); // Remove username dependency to avoid infinite loops

    // Update username input when username changes from store
    useEffect(() => {
        if (username && username !== usernameInput) {
            setUsernameInput(username);
        }
    }, [username]);

    // Check user authentication and fetch profile data
    useEffect(() => {
        const checkUser = async () => {
            try {
                // First check if we have a session
                const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

                if (sessionError || !sessionData.session) {
                    console.error('No active session:', sessionError);
                    router.push('/login');
                    return;
                }

                // Then get the user
                const { data: { user }, error } = await supabase.auth.getUser();

                if (error || !user) {
                    console.error('Authentication error:', error);
                    router.push('/login');
                    return;
                }

                setUser(user);

                // Fetch user profile data
                const { data: profiles, error: profileError } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single();

                if (profileError) {
                    console.error('Error fetching profile:', profileError);

                    // If no profile found, create one
                    if (profileError.code === 'PGRST116') { // No rows returned
                        const username = user.email?.split('@')[0] || `user_${user.id.slice(0, 6)}`;

                        const { error: createError } = await supabase
                            .from('profiles')
                            .insert({
                                id: user.id,
                                user_id: user.id,
                                username: username,
                                email: user.email,
                                created_at: new Date().toISOString(),
                                updated_at: new Date().toISOString()
                            });

                        if (createError) {
                            console.error('Error creating profile:', createError);
                            throw createError;
                        }

                        // Set username after profile creation
                        setUsername(username);
                        setUsernameInput(username);
                    } else {
                        throw profileError;
                    }
                } else if (profiles) {
                    // Load profile data into stores
                    setUsername(profiles.username);
                    setUsernameInput(profiles.username);

                    // Fetch blocks for this user
                    const { data: blocksData, error: blocksError } = await supabase
                        .from('blocks')
                        .select('*')
                        .eq('profile_id', user.id)
                        .order('sort_order', { ascending: true });

                    if (blocksError) {
                        console.error('Error fetching blocks:', blocksError);
                    } else if (blocksData && blocksData.length > 0) {
                        console.log('Loaded blocks from Supabase:', blocksData);

                        // Transform blocks to match the expected format in our application
                        const formattedBlocks = blocksData.map(block => {
                            // Extract content from the database block and convert it to our app's Block format
                            const { id, type, content, sort_order, settings } = block;

                            // Create a block that matches our application's Block type structure
                            return {
                                id,
                                type,
                                props: content, // The content field in DB contains our props
                                ...content, // Spread content to maintain backward compatibility
                                settings
                            };
                        });

                        console.log('Formatted blocks for app:', formattedBlocks);
                        // Use setLayout instead of loadLayout since we're passing blocks array
                        setLayout(formattedBlocks);
                    } else {
                        console.log('No blocks found for user, using default layout');
                        // Optional: You could load a default layout here
                    }
                }
            } catch (error) {
                console.error('Error in checkUser:', error);
                router.push('/login');
            } finally {
                setIsLoading(false);
            }
        };

        checkUser();
    }, [supabase, router]);

    // Drag and Drop handlers
    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        const activeBlockData = blocks.find(block => block.id === active.id);

        if (activeBlockData) {
            setActiveBlock(activeBlockData);
            setIsDragging(true);
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        setActiveBlock(null);
        setIsDragging(false);

        if (!over || active.id === over.id) {
            return;
        }

        const oldIndex = blocks.findIndex(block => block.id === active.id);
        const newIndex = blocks.findIndex(block => block.id === over.id);

        if (oldIndex !== -1 && newIndex !== -1) {
            reorderBlocks(oldIndex, newIndex);
        }
    };

    const handleDragCancel = () => {
        setActiveBlock(null);
        setIsDragging(false);
    };

    // Block management functions
    const handleAddBlock = (type: Block['type']) => {
        const newBlock = createBlock(type);
        addBlockToLayout(newBlock);
        setSelectedBlockId(newBlock.id);
    };

    const handleUpdateBlock = (updatedBlock: Block) => {
        updateBlockInLayout(updatedBlock);
    };

    const handleDeleteBlock = (blockId: string) => {
        deleteBlockFromLayout(blockId);
        if (selectedBlockId === blockId) {
            setSelectedBlockId(null);
        }
    };

    const handleDuplicateBlock = (blockId: string) => {
        const blockToDuplicate = blocks.find(b => b.id === blockId);
        if (blockToDuplicate) {
            const duplicatedBlock = createBlock(blockToDuplicate.type, blockToDuplicate.props);
            duplicateBlockInLayout(blockId, duplicatedBlock);
            setSelectedBlockId(duplicatedBlock.id);
        }
    };

    // Username handling with validation and migration
    const handleUsernameChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.trim().toLowerCase();
        setUsernameInput(value);

        // Clear previous errors
        setUsernameError('');

        // Validation
        if (!value) {
            setUsernameError('Username is required');
            return;
        }

        if (value.length < 3) {
            setUsernameError('Username must be at least 3 characters');
            return;
        }

        if (value.length > 20) {
            setUsernameError('Username must be less than 20 characters');
            return;
        }

        if (!/^[a-z0-9_-]+$/.test(value)) {
            setUsernameError('Username can only contain lowercase letters, numbers, underscores, and hyphens');
            return;
        }

        // If validation passes and username actually changed
        const currentUsername = username;
        if (currentUsername && currentUsername !== value) {
            try {
                // Migrate data from old username to new username
                await loadFromStorage(currentUsername); // Ensure current data is loaded
                await usePersistenceStore.getState().migrateUsername(currentUsername, value);

                // Now set the new username
                setUsername(value);

                console.log(`Migrated data from ${currentUsername} to ${value}`);
            } catch (error) {
                console.error('Failed to migrate username:', error);
                setUsernameError('Failed to update username');
                return;
            }
        } else if (!currentUsername) {
            // First time setting username
            setUsername(value);
        }
    };

    // Apply username change (for manual save button if needed)
    const applyUsername = () => {
        if (!usernameInput || usernameError) return;
        setUsername(usernameInput);
    };

    // Update handleSave function
    const handleSave = async () => {
        if (!user) return;

        setIsSaving(true);
        try {
            // Apply any pending username changes first
            if (usernameInput !== username) {
                await applyUsername();
            }

            console.log('Saving profile data to Supabase');

            // First update the profile
            const { error: profileError } = await supabase
                .from('profiles')
                .update({
                    username: username,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', user.id);

            if (profileError) {
                console.error('Error updating profile:', profileError);
                throw profileError;
            }

            // Save blocks data - first delete existing blocks
            try {
                // Save blocks data - first delete existing blocks
                const { error: deleteError } = await supabase
                    .from('blocks')
                    .delete()
                    .eq('profile_id', user.id);

                if (deleteError) {
                    console.error('Error deleting existing blocks:', deleteError);
                    // Continue anyway - the blocks might not exist yet
                }

                // Then insert new blocks if we have any
                if (blocks.length > 0) {
                    const blocksToInsert = blocks.map((block, index) => {
                        // Create a database-compatible block object
                        const dbBlock = {
                            profile_id: user.id,
                            type: block.type,
                            content: block.props, // Store props as content
                            sort_order: index, // Changed from 'order' to 'sort_order' to match DB schema
                            settings: null // Default to null
                        };

                        // Add any additional properties that might be in the database schema but not in our Block type
                        if ('settings' in block) {
                            dbBlock.settings = (block as any).settings;
                        }

                        return dbBlock;
                    });

                    console.log('Saving blocks to Supabase:', blocksToInsert);

                    // Try inserting with the authenticated client
                    const { error: insertError } = await supabase
                        .from('blocks')
                        .insert(blocksToInsert);

                    if (insertError) {
                        console.error('Error inserting blocks:', insertError);
                        console.log('Falling back to localStorage only');
                        // Don't throw, we'll still save to localStorage as backup
                    } else {
                        console.log('Blocks saved to Supabase successfully');
                    }
                }
            } catch (blockError) {
                console.error('Error managing blocks:', blockError);
                // Continue to localStorage save as fallback
            }

            // Always save to local storage as backup
            await saveToStorage();

            console.log('Profile and blocks saved successfully to localStorage');

            // Optional: Show success message
            // You could add a toast notification here

        } catch (error) {
            console.error('Error saving profile:', error);
            // Handle error (show toast notification)
        } finally {
            setIsSaving(false);
        }
    };

    const handlePreview = () => {
        // Ensure username is set before preview
        const currentUsername = username || usernameInput;

        if (!currentUsername) {
            alert('Please set a username before previewing');
            return;
        }

        if (usernameError) {
            alert(`Please fix username error: ${usernameError}`);
            return;
        }

        // Make sure username is saved
        if (!username && usernameInput && !usernameError) {
            setUsername(usernameInput);
        }

        router.push(`/${currentUsername}`);
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

    // Render editor based on selected block
    const renderEditor = () => {
        const selectedBlock = blocks.find(b => b.id === selectedBlockId);
        if (!selectedBlock) return null;

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

    if (isLoading) {
        return (
            <div className="container mx-auto p-4 flex items-center justify-center min-h-screen">
                <div className="text-center">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar
                title="Profile Builder"
                subtitle={username ? `Editing ${username}'s profile` : 'Create your profile'}
                showBackButton={true}
            />

            <div className="container mx-auto px-4 py-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        {/* Undo/Redo Controls */}
                        {isEditing && (
                            <>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={undo}
                                    disabled={!canUndo()}
                                    title="Undo"
                                >
                                    <Undo className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={redo}
                                    disabled={!canRedo()}
                                    title="Redo"
                                >
                                    <Redo className="w-4 h-4" />
                                </Button>
                                <Separator orientation="vertical" className="h-6" />
                            </>
                        )}

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
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            onClick={handlePreview}
                            disabled={!username && !usernameInput}
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

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Block Library Sidebar */}
                    {isEditing && (
                        <div className="lg:col-span-3">
                            <div className="space-y-4">
                                {/* Block Library */}


                                {/* Username Settings */}
                                <Card>
                                    <CardContent className="p-4">
                                        <div className="flex items-center gap-2 mb-4">
                                            <User className="w-4 h-4" />
                                            <h3 className="font-semibold">Profile Settings</h3>
                                        </div>
                                        <div className="space-y-3">
                                            <div>
                                                <Label htmlFor="username">Username</Label>
                                                <Input
                                                    id="username"
                                                    type="text"
                                                    value={usernameInput}
                                                    onChange={handleUsernameChange}
                                                    placeholder="Enter username"
                                                    className={usernameError ? 'border-red-500' : ''}
                                                />
                                                {usernameError && (
                                                    <p className="text-xs text-red-500 mt-1">{usernameError}</p>
                                                )}
                                                {username && !usernameError && (
                                                    <p className="text-xs text-green-600 mt-1">
                                                        ✓ Profile URL: /{username}
                                                    </p>
                                                )}
                                                {usernameInput && !username && !usernameError && (
                                                    <p className="text-xs text-blue-600 mt-1">
                                                        Preview URL: /{usernameInput}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    )}

                    {/* Main Canvas with Drag & Drop */}
                    <div className={`${isEditing ? 'lg:col-span-6' : 'lg:col-span-9'}`}>
                        <div className={`mx-auto transition-all duration-300 ${previewSizes[previewMode]}`}>
                            {/* Drag Instructions */}
                            {isEditing && blocks.length > 1 && (
                                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                    <div className="flex items-center gap-2 text-sm text-blue-700">
                                        <MousePointer className="w-4 h-4" />
                                        <span>
                                            Hover over blocks to see drag handles. Drag blocks to reorder them.
                                        </span>
                                    </div>
                                </div>
                            )}

                            {blocks.length === 0 ? (
                                <DragDropCanvas
                                    blocks={blocks}
                                    onUpdateBlock={handleUpdateBlock}
                                    onDeleteBlock={handleDeleteBlock}
                                    onDuplicateBlock={handleDuplicateBlock}
                                    onSelectBlock={setSelectedBlockId}
                                    selectedBlockId={selectedBlockId}
                                    onAddBlock={handleAddBlock}
                                />
                            ) : (
                                <DndContext
                                    sensors={sensors}
                                    collisionDetection={closestCenter}
                                    onDragStart={handleDragStart}
                                    onDragEnd={handleDragEnd}
                                    onDragCancel={handleDragCancel}
                                    modifiers={[restrictToVerticalAxis]}
                                >
                                    <SortableContext
                                        items={blocks.map(block => block.id)}
                                        strategy={verticalListSortingStrategy}
                                    >
                                        <div className={`space-y-4 ${isEditing ? 'pl-12' : ''}`}>
                                            {blocks.map((block) => (
                                                <BlockRenderer
                                                    key={block.id}
                                                    block={block}
                                                    isEditing={isEditing}
                                                    isSelected={selectedBlockId === block.id}
                                                    isDragging={isDragging && activeBlock?.id === block.id}
                                                    onUpdate={handleUpdateBlock}
                                                    onDelete={handleDeleteBlock}
                                                    onDuplicate={handleDuplicateBlock}
                                                    onSelect={setSelectedBlockId}
                                                    onAddBlock={handleAddBlock}
                                                />
                                            ))}
                                        </div>
                                    </SortableContext>

                                    <DragOverlay dropAnimation={dropAnimationConfig}>
                                        {activeBlock ? (
                                            <div className="transform rotate-3 shadow-2xl">
                                                <BlockRenderer
                                                    block={activeBlock}
                                                    isEditing={false}
                                                    isSelected={false}
                                                    isDragging={true}
                                                    onUpdate={() => { }}
                                                    onDelete={() => { }}
                                                    onDuplicate={() => { }}
                                                    onSelect={() => { }}
                                                    onAddBlock={() => { }}
                                                />
                                            </div>
                                        ) : null}
                                    </DragOverlay>
                                </DndContext>
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
                </div>
            </div>
        </div>
    );
};

export default EditPage;
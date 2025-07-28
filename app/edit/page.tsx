'use client'
import React, { useState, useEffect } from 'react';
import { useSupabase } from '@/components/providers/SupabaseProvider';
import { useBlocks } from '@/hooks/supabase/useBlocks';
import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { useLinks } from '@/hooks/supabase/useLinks';
import { useProfile } from '@/hooks/supabase/useProfile';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Block, createBlock, blockTypes } from '@/shared/app/blocks';
import { Link, createLink } from '@/shared/app/links';
import { mapBlockToDb, mapLinkToDb } from '@/shared/supabase/mappings';
import { useUserStore } from '@/lib/stores/userStore';
import { useBlocksStore } from '@/lib/stores/blocksStore';
import { useLinksStore } from '@/lib/stores/linksStore';
import { useLayoutStore } from '@/lib/stores/layoutStore';
import { usePersistenceStore } from '@/lib/stores/persistenceStore';

const EditPage: React.FC = () => {
    const { user, supabase } = useSupabase();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'blocks' | 'profile' | 'links'>('blocks');
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Store hooks
    const { profile, setProfile } = useUserStore();
    const { blocks, setBlocks, addBlock, updateBlock, deleteBlock } = useBlocksStore();
    const { links, setLinks, addLink, updateLink, deleteLink } = useLinksStore();
    const { saveToStorage } = usePersistenceStore();

    // Track if user is ready
    const [userReady, setUserReady] = useState(false);

    // Wait for user to be available before fetching data
    useEffect(() => {
        if (user) {
            console.log('User authenticated, ID:', user.id);
            setUserReady(true);
        } else {
            console.log('No user available yet');
        }
    }, [user]);

    // Hooks for data fetching - only fetch when user is available
    const { profile: userProfile, loading: profileLoading, error: profileError } = useProfile({
        id: userReady ? user?.id || '' : ''
    });
    const { blocks: userBlocks, isLoading: blocksLoading, error: blocksError } = useBlocks(
        userReady ? user?.id || '' : ''
    );
    const { links: userLinks, loading: linksLoading, error: linksError } = useLinks(
        userReady ? user?.id || '' : ''
    );

    // Form states
    const [newBlockType, setNewBlockType] = useState<Block['type']>('name');
    const [newLinkType, setNewLinkType] = useState<Link['type']>('normal');
    const [newLinkUrl, setNewLinkUrl] = useState('');
    const [newLinkTitle, setNewLinkTitle] = useState('');
    const [editingBlock, setEditingBlock] = useState<Block | null>(null);
    const [editingLink, setEditingLink] = useState<Link | null>(null);

    // Profile form state
    const [profileForm, setProfileForm] = useState({
        fullName: '',
        username: '',
        bio: '',
        tagline: '',
        imageUrl: ''
    });

    // Check if user is authenticated
    useEffect(() => {
        if (!user && !isLoading) {
            console.log('No authenticated user, redirecting to login');
            router.push('/login');
        }
    }, [user, router, isLoading]);

    // Handle data loading
    useEffect(() => {
        if (!userReady) {
            console.log('Waiting for user to be ready');
            return;
        }

        const loadData = async () => {
            try {
                setIsLoading(true);
                console.log('Loading data for user:', user?.id);
                console.log('Loading states:', { profileLoading, blocksLoading, linksLoading });

                // Check for errors from hooks
                if (profileError) {
                    console.error('Profile error:', profileError);
                    throw profileError;
                }
                if (blocksError) {
                    console.error('Blocks error:', blocksError);
                    throw blocksError;
                }
                if (linksError) {
                    console.error('Links error:', linksError);
                    throw linksError;
                }

                // Wait for all data to be loaded
                if (!profileLoading && !blocksLoading && !linksLoading) {
                    console.log('All data loaded:', {
                        profile: userProfile,
                        blocks: userBlocks,
                        links: userLinks
                    });

                    // Set data from hooks to stores
                    if (userProfile) {
                        setProfile(userProfile);
                        setProfileForm({
                            fullName: userProfile.fullName || '',
                            username: userProfile.username || '',
                            bio: userProfile.bio || '',
                            tagline: userProfile.tagline || '',
                            imageUrl: typeof userProfile.image === 'string' ? userProfile.image :
                                (userProfile.image && typeof userProfile.image === 'object' && 'url' in userProfile.image) ?
                                    userProfile.image.url : ''
                        });
                    }

                    if (userBlocks) {
                        console.log('Setting blocks in store:', userBlocks);
                        setBlocks(userBlocks);
                    }

                    if (userLinks) {
                        console.log('Setting links in store:', userLinks);
                        setLinks(userLinks);
                    }

                    setIsLoading(false);
                }
            } catch (error) {
                console.error('Error loading data:', error);
                toast.error('Failed to load your profile data');
                setIsLoading(false);
            }
        };

        loadData();
    }, [
        userReady,
        user,
        profileLoading, blocksLoading, linksLoading,
        profileError, blocksError, linksError
    ]);

    // Handle save
    const handleSave = async () => {
        if (!user || !profile) {
            toast.error('You must be logged in to save changes');
            return;
        }

        setIsSaving(true);
        try {
            // Update profile in database
            if (profile.id) {
                const { error: updateError } = await supabase
                    .from('profiles')
                    .update({
                        full_name: profileForm.fullName,
                        bio: profileForm.bio,
                        tagline: profileForm.tagline,
                        image_url: profileForm.imageUrl
                    })
                    .eq('user_id', user.id);

                if (updateError) throw updateError;
            }

            // Save blocks to database
            if (blocks.length > 0) {
                // First delete existing blocks
                const { error: deleteBlocksError } = await supabase
                    .from('blocks')
                    .delete()
                    .eq('profile_id', profile.id);

                if (deleteBlocksError) throw deleteBlocksError;

                // Then insert new blocks
                const dbBlocks = blocks.map((block, index) =>
                    mapBlockToDb({
                        ...block,
                        profileId: profile.id,
                        sortOrder: index
                    })
                );

                const { error: insertBlocksError } = await supabase
                    .from('blocks')
                    .insert(dbBlocks);

                if (insertBlocksError) throw insertBlocksError;
            }

            // Save links to database
            if (links.length > 0) {
                // First delete existing links
                const { error: deleteLinksError } = await supabase
                    .from('links')
                    .delete()
                    .eq('profile_id', profile.id);

                if (deleteLinksError) throw deleteLinksError;

                // Then insert new links
                const dbLinks = links.map((link, index) =>
                    mapLinkToDb({
                        ...link,
                        profileId: profile.id,
                        sortOrder: index
                    })
                );

                const { error: insertLinksError } = await supabase
                    .from('links')
                    .insert(dbLinks);

                if (insertLinksError) throw insertLinksError;
            }

            // Save to localStorage as backup
            await saveToStorage();

            toast.success('Changes saved successfully!');
        } catch (error) {
            console.error('Error saving changes:', error);
            toast.error('Failed to save changes');
        } finally {
            setIsSaving(false);
        }
    };

    // Handle preview
    const handlePreview = () => {
        if (profile?.username) {
            router.push(`/${profile.username}`);
        } else {
            toast.error('You need a username to preview your profile');
        }
    };

    // Add a new block
    const handleAddBlock = () => {
        const newBlock = createBlock(newBlockType, {
            profileId: profile?.id || '',
        });
        addBlock(newBlock);
        toast.success(`Added new ${newBlockType} block`);
    };

    // Add a new link
    const handleAddLink = () => {
        if (!newLinkUrl || !newLinkTitle) {
            toast.error('Please enter both URL and title for the link');
            return;
        }

        const newLink = createLink(newLinkType, {
            profileId: profile?.id || '',
            url: newLinkUrl,
            title: newLinkTitle
        });
        addLink(newLink);
        setNewLinkUrl('');
        setNewLinkTitle('');
        toast.success('Link added successfully');
    };

    // Update profile form
    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProfileForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Update block
    const handleUpdateBlock = (updatedBlock: Block) => {
        updateBlock(updatedBlock.id, updatedBlock);
        setEditingBlock(null);
        toast.success('Block updated');
    };

    // Update link
    const handleUpdateLink = (updatedLink: Link) => {
        updateLink(updatedLink.id, updatedLink);
        setEditingLink(null);
        toast.success('Link updated');
    };

    // Render tabs
    const renderTabs = () => {
        return (
            <div className="flex border-b mb-6">
                <button
                    className={`px-4 py-2 ${activeTab === 'blocks' ? 'border-b-2 border-blue-500 font-medium' : ''}`}
                    onClick={() => setActiveTab('blocks')}
                >
                    Blocks
                </button>
                <button
                    className={`px-4 py-2 ${activeTab === 'profile' ? 'border-b-2 border-blue-500 font-medium' : ''}`}
                    onClick={() => setActiveTab('profile')}
                >
                    Profile Settings
                </button>
                <button
                    className={`px-4 py-2 ${activeTab === 'links' ? 'border-b-2 border-blue-500 font-medium' : ''}`}
                    onClick={() => setActiveTab('links')}
                >
                    Links
                </button>
            </div>
        );
    };

    // Render blocks tab
    const renderBlocksTab = () => {
        return (
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Add New Block</CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center gap-4">
                        <select
                            className="p-2 border rounded"
                            value={newBlockType}
                            onChange={(e) => setNewBlockType(e.target.value as Block['type'])}
                        >
                            {blockTypes.map(type => (
                                <option key={type.type} value={type.type}>
                                    {type.label}
                                </option>
                            ))}
                        </select>
                        <Button onClick={handleAddBlock}>Add Block</Button>
                    </CardContent>
                </Card>

                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Your Blocks</h3>
                    {blocks.length === 0 ? (
                        <p className="text-gray-500">No blocks added yet. Add your first block above.</p>
                    ) : (
                        blocks.map((block) => (
                            <Card key={block.id} className="mb-4">
                                <CardHeader>
                                    <CardTitle className="flex justify-between items-center">
                                        <span>{blockTypes.find(t => t.type === block.type)?.label || block.type}</span>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setEditingBlock(block)}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => {
                                                    deleteBlock(block.id);
                                                    toast.success('Block deleted');
                                                }}
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {block.type === 'name' && <p>Name: {block.content?.text}</p>}
                                    {block.type === 'bio' && <p>Bio: {block.content?.text}</p>}
                                    {block.type === 'tagline' && <p>Tagline: {block.content?.text}</p>}
                                    {block.type === 'link' && (
                                        <div>
                                            <p>Label: {block.content?.label}</p>
                                            <p>URL: {block.content?.url}</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>

                {/* Block Editor Modal */}
                {editingBlock && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <Card className="w-full max-w-md">
                            <CardHeader>
                                <CardTitle>Edit {editingBlock.type} Block</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {editingBlock.type === 'name' && (
                                    <div className="space-y-4">
                                        <div>
                                            <Label htmlFor="name-text">Name</Label>
                                            <Input
                                                id="name-text"
                                                value={editingBlock.content?.text || ''}
                                                onChange={(e) => setEditingBlock({
                                                    ...editingBlock,
                                                    content: { ...editingBlock.content, text: e.target.value }
                                                })}
                                            />
                                        </div>
                                    </div>
                                )}

                                {editingBlock.type === 'bio' && (
                                    <div className="space-y-4">
                                        <div>
                                            <Label htmlFor="bio-text">Bio</Label>
                                            <Textarea
                                                id="bio-text"
                                                value={editingBlock.content?.text || ''}
                                                onChange={(e) => setEditingBlock({
                                                    ...editingBlock,
                                                    content: { ...editingBlock.content, text: e.target.value }
                                                })}
                                                rows={5}
                                            />
                                        </div>
                                    </div>
                                )}

                                {editingBlock.type === 'tagline' && (
                                    <div className="space-y-4">
                                        <div>
                                            <Label htmlFor="tagline-text">Tagline</Label>
                                            <Input
                                                id="tagline-text"
                                                value={editingBlock.content?.text || ''}
                                                onChange={(e) => setEditingBlock({
                                                    ...editingBlock,
                                                    content: { ...editingBlock.content, text: e.target.value }
                                                })}
                                            />
                                        </div>
                                    </div>
                                )}

                                {editingBlock.type === 'link' && (
                                    <div className="space-y-4">
                                        <div>
                                            <Label htmlFor="link-label">Label</Label>
                                            <Input
                                                id="link-label"
                                                value={editingBlock.content?.label || ''}
                                                onChange={(e) => setEditingBlock({
                                                    ...editingBlock,
                                                    content: { ...editingBlock.content, label: e.target.value }
                                                })}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="link-url">URL</Label>
                                            <Input
                                                id="link-url"
                                                value={editingBlock.content?.url || ''}
                                                onChange={(e) => setEditingBlock({
                                                    ...editingBlock,
                                                    content: { ...editingBlock.content, url: e.target.value }
                                                })}
                                            />
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                            <CardFooter className="flex justify-between">
                                <Button variant="outline" onClick={() => setEditingBlock(null)}>Cancel</Button>
                                <Button onClick={() => handleUpdateBlock(editingBlock)}>Save Changes</Button>
                            </CardFooter>
                        </Card>
                    </div>
                )}
            </div>
        );
    };

    // Render profile tab
    const renderProfileTab = () => {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Profile Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input
                            id="fullName"
                            name="fullName"
                            value={profileForm.fullName}
                            onChange={handleProfileChange}
                        />
                    </div>
                    <div>
                        <Label htmlFor="username">Username</Label>
                        <Input
                            id="username"
                            name="username"
                            value={profileForm.username}
                            onChange={handleProfileChange}
                            disabled={!!profile?.username} // Disable if username is already set
                        />
                        {profile?.username && (
                            <p className="text-xs text-gray-500 mt-1">Username cannot be changed once set</p>
                        )}
                    </div>
                    <div>
                        <Label htmlFor="tagline">Tagline</Label>
                        <Input
                            id="tagline"
                            name="tagline"
                            value={profileForm.tagline}
                            onChange={handleProfileChange}
                        />
                    </div>
                    <div>
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                            id="bio"
                            name="bio"
                            value={profileForm.bio}
                            onChange={handleProfileChange}
                            rows={5}
                        />
                    </div>
                    <div>
                        <Label htmlFor="imageUrl">Profile Image URL</Label>
                        <Input
                            id="imageUrl"
                            name="imageUrl"
                            value={profileForm.imageUrl}
                            onChange={handleProfileChange}
                        />
                    </div>
                </CardContent>
            </Card>
        );
    };

    // Render links tab
    const renderLinksTab = () => {
        return (
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Add New Link</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="link-type">Link Type</Label>
                            <select
                                id="link-type"
                                className="w-full p-2 border rounded"
                                value={newLinkType}
                                onChange={(e) => setNewLinkType(e.target.value as Link['type'])}
                            >
                                <option value="normal">Normal</option>
                                <option value="social">Social</option>
                                <option value="blog">Blog</option>
                            </select>
                        </div>
                        <div>
                            <Label htmlFor="link-title">Title</Label>
                            <Input
                                id="link-title"
                                value={newLinkTitle}
                                onChange={(e) => setNewLinkTitle(e.target.value)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="link-url">URL</Label>
                            <Input
                                id="link-url"
                                value={newLinkUrl}
                                onChange={(e) => setNewLinkUrl(e.target.value)}
                            />
                        </div>
                        <Button onClick={handleAddLink}>Add Link</Button>
                    </CardContent>
                </Card>

                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Your Links</h3>
                    {links.length === 0 ? (
                        <p className="text-gray-500">No links added yet. Add your first link above.</p>
                    ) : (
                        links.map((link) => (
                            <Card key={link.id} className="mb-4">
                                <CardHeader>
                                    <CardTitle className="flex justify-between items-center">
                                        <span>{link.title}</span>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setEditingLink(link)}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                variant={link.isActive ? "outline" : "default"}
                                                size="sm"
                                                onClick={() => {
                                                    updateLink(link.id, {
                                                        ...link,
                                                        isActive: !link.isActive
                                                    });
                                                    toast.success(link.isActive ? 'Link disabled' : 'Link enabled');
                                                }}
                                            >
                                                {link.isActive ? 'Disable' : 'Enable'}
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => {
                                                    deleteLink(link.id);
                                                    toast.success('Link deleted');
                                                }}
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm truncate">{link.url}</p>
                                    <p className="text-xs text-gray-500 mt-1">Type: {link.type}</p>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>

                {/* Link Editor Modal */}
                {editingLink && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <Card className="w-full max-w-md">
                            <CardHeader>
                                <CardTitle>Edit Link</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="edit-link-title">Title</Label>
                                    <Input
                                        id="edit-link-title"
                                        value={editingLink.title}
                                        onChange={(e) => setEditingLink({
                                            ...editingLink,
                                            title: e.target.value
                                        })}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="edit-link-url">URL</Label>
                                    <Input
                                        id="edit-link-url"
                                        value={editingLink.url}
                                        onChange={(e) => setEditingLink({
                                            ...editingLink,
                                            url: e.target.value
                                        })}
                                    />
                                </div>
                                {editingLink.type === 'social' && (
                                    <div>
                                        <Label htmlFor="edit-link-platform">Platform</Label>
                                        <select
                                            id="edit-link-platform"
                                            className="w-full p-2 border rounded"
                                            value={editingLink.platform}
                                            onChange={(e) => setEditingLink({
                                                ...editingLink,
                                                platform: e.target.value as any
                                            })}
                                        >
                                            <option value="twitter">Twitter</option>
                                            <option value="instagram">Instagram</option>
                                            <option value="facebook">Facebook</option>
                                            <option value="linkedin">LinkedIn</option>
                                            <option value="github">GitHub</option>
                                            <option value="youtube">YouTube</option>
                                            <option value="tiktok">TikTok</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                )}
                            </CardContent>
                            <CardFooter className="flex justify-between">
                                <Button variant="outline" onClick={() => setEditingLink(null)}>Cancel</Button>
                                <Button onClick={() => handleUpdateLink(editingLink)}>Save Changes</Button>
                            </CardFooter>
                        </Card>
                    </div>
                )}
            </div>
        );
    };

    if (isLoading) {
        return (
            <div className="flex flex-col h-screen">
                <Navbar />
                <div className="flex-1 flex items-center justify-center">
                    <p>Loading your profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />

            <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold">Edit Your Profile</h1>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={handlePreview}
                        >
                            Preview
                        </Button>
                        <Button
                            onClick={handleSave}
                            disabled={isSaving}
                        >
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </div>

                {renderTabs()}

                <div className="mt-6">
                    {activeTab === 'blocks' && renderBlocksTab()}
                    {activeTab === 'profile' && renderProfileTab()}
                    {activeTab === 'links' && renderLinksTab()}
                </div>
            </main>
        </div>
    );
};

export default EditPage;
'use client';

import { useState, useEffect } from 'react';
import { useSupabase } from '@/components/providers/SupabaseProvider';

import { linkService, blockService, profileService, preferenceService } from '@/supabase/services';

export default function AuthTestClient() {
    const { supabase, user, logout } = useSupabase();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [profileData, setProfileData] = useState<any>(null);
    const [loadingProfile, setLoadingProfile] = useState(false);
    const [profile, setProfile] = useState<any>(null);
    const [links, setLinks] = useState<any[]>([]);
    const [blocks, setBlocks] = useState<any[]>([]);
    const [preferences, setPreferences] = useState<any>(null);
    // Edit profile
    const [editing, setEditing] = useState(false);
    const [editFields, setEditFields] = useState({
        full_name: '',
        bio: '',
        tagline: '',
        image_url: ''
    });
    const [saving, setSaving] = useState(false);

    // Add link
    const [addingLink, setAddingLink] = useState(false);
    const [newLink, setNewLink] = useState<{
        title: string;
        url: string;
        type: 'normal' | 'social' | 'blog';
    }>({
        title: '',
        url: '',
        type: 'normal'
    });
    const [addingLinkLoading, setAddingLinkLoading] = useState(false);

    // Add block
    const [addingBlock, setAddingBlock] = useState(false);
    const [newBlock, setNewBlock] = useState({
        type: 'text',
        content: '{}'
    });
    const [addingBlockLoading, setAddingBlockLoading] = useState(false);

    // Add delete block handler
    const [deletingBlock, setDeletingBlock] = useState(false);
    const [deletingBlockId, setDeletingBlockId] = useState<string | null>(null);

    // Add delete link handler
    const [deletingLink, setDeletingLink] = useState(false);
    const [deletingLinkId, setDeletingLinkId] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) setError(error.message);
    };

    // Fetch all user data after login
    // Fetch all user data after login
    const fetchProfile = async () => {
        if (!user) {
            setProfileData(null);
            return;
        }
        setLoadingProfile(true);
        setError(null);

        try {
            const prof = await profileService.getProfileByUserId(user.id); // ✅ session-bound
            setProfileData(prof ?? null);
            setLoadingProfile(false);

            if (prof) {
                setEditFields({
                    full_name: prof.fullName || '',
                    bio: prof.bio || '',
                    tagline: prof.tagline || '',
                    image_url: prof.image?.url || '',
                });
            } else {
                // First sign-in: profile row not created yet
                setError('Profile not found yet (will be created on first save or by trigger).');
            }
        } catch (err: any) {
            console.error('Error fetching profile:', err);
            setError(`Error fetching profile: ${err.message}`);
            setLoadingProfile(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, [user, supabase]);

    useEffect(() => {
        const fetchLinks = async () => {
            if (!profileData?.id) { setLinks([]); return; }
            const fetchedLinks = await linkService.getLinks(profileData.id); // should return app `Link[]`
            setLinks(fetchedLinks);
        };
        fetchLinks();

        const fetchBlocks = async () => {
            if (!profileData?.id) { setBlocks([]); return; }
            const fetchedBlocks = await blockService.getBlocks(profileData.id); // app `Block[]`
            setBlocks(fetchedBlocks);
        };
        fetchBlocks();
    }, [profileData?.id]);


    // Profile edit logic (same as before)
    const handleEdit = () => setEditing(true);
    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setEditFields({ ...editFields, [e.target.name]: e.target.value });
    };
    const handleEditCancel = () => {
        setEditing(false);
        if (profileData) {
            setEditFields({
                full_name: profileData.full_name || '',
                bio: profileData.bio || '',
                tagline: profileData.tagline || '',
                image_url: profileData.image_url || ''
            });
        }
    };
    const handleEditSave = async () => {
        if (!profileData?.id) return;
        setSaving(true);
        setError(null);
        try {
            // If your service expects UI shape:
            const updated = await profileService.updateProfileById(profileData.id, {
                full_name: editFields.full_name,
                bio: editFields.bio,
                tagline: editFields.tagline,
                // url: editFields.image_url ? { url: editFields.image_url } : undefined,
                // username: (optional) if you allow changing username
            });
            setProfileData(updated);     // ✅ stays camelCase
            setEditing(false);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setSaving(false);
        }
    };


    // Add Link logic
    const handleAddLink = async () => {
        console.log('Adding link for profile:', profileData);
        if (!profileData?.id) return;
        setAddingLinkLoading(true);
        setError(null);

        const result = await linkService.createLink(profileData.id, {
            profileId: profileData.id,
            title: newLink.title,
            url: newLink.url,
            type: newLink.type,
            sortOrder: (Array.isArray(profileData.links) ? profileData.links.length : 0) + 1,
            isActive: true,
        });

        console.log('Add link result:', result);

        setAddingLinkLoading(false);

        if (result?.error) {
            setError(result.error.message);
            return;
        }

        setAddingLink(false);
        setNewLink({ title: '', url: '', type: 'normal' });

        // Refetch profile data using your service
        const updatedProfile = await profileService.getPublicProfile(profileData.username);
        console.log('Updated profile after add:', updatedProfile);
        setProfileData(updatedProfile);
    };
    // Add Block logic
    const handleAddBlock = async () => {
        if (!profileData?.id) return;
        setAddingBlockLoading(true);
        setError(null);
        let contentObj;
        try {
            contentObj = JSON.parse(newBlock.content);
        } catch {
            setError('Block content must be valid JSON');
            setAddingBlockLoading(false);
            return;
        }
        const { error } = await supabase
            .from('blocks')
            .insert({
                profile_id: profileData.id,
                type: newBlock.type,
                content: contentObj
            });
        setAddingBlockLoading(false);
        if (error) {
            setError(error.message);
        } else {
            setAddingBlock(false);
            setNewBlock({ type: 'text', content: '{}' });
            // Refetch profile data
            const { data } = await supabase
                .from('profiles')
                .select('*, links(*), blocks(*), preferences(*)')
                .eq('username', profileData.username)
                .single();
            setProfileData(data);
        }
    };

    // Handle delete block
    const handleDeleteBlock = async (blockId: string) => {
        if (!blockId) return;

        console.log('Deleting block with ID:', blockId);
        setDeletingBlock(true);
        setDeletingBlockId(blockId);
        setError(null);

        try {
            // First try using the block service
            const result = await blockService.deleteBlock(blockId);
            console.log('Delete block service result:', result);

            // Verify deletion by checking if the block still exists
            const { data: checkData } = await supabase
                .from('blocks')
                .select('*')
                .eq('id', blockId);

            if (checkData && checkData.length > 0) {
                console.log('Block still exists after deletion attempt. Trying direct Supabase call...');

                // If block still exists, try direct deletion as fallback
                const { error: directError } = await supabase
                    .from('blocks')
                    .delete()
                    .eq('id', blockId);

                if (directError) {
                    console.error('Direct deletion error:', directError);
                    throw new Error(`Failed to delete block: ${directError.message}`);
                }

                console.log('Block deleted via direct Supabase call');
            } else {
                console.log('Block successfully deleted');
            }

            // Refresh blocks after deletion
            if (profileData?.id) {
                const fetchedBlocks = await blockService.getBlocks(profileData.id);
                setBlocks(fetchedBlocks);

                // Also refresh the profile data to update the UI
                await fetchProfile();
            }
        } catch (err: any) {
            console.error('Error deleting block:', err);
            setError(`Error deleting block: ${err.message}`);
        } finally {
            setDeletingBlock(false);
            setDeletingBlockId(null);
        }
    };

    // Handle delete link
    const handleDeleteLink = async (linkId: string) => {
        if (!linkId) return;

        console.log('Deleting link with ID:', linkId);
        setDeletingLink(true);
        setDeletingLinkId(linkId);
        setError(null);

        try {
            const result = await linkService.deleteLink(linkId);
            console.log('Delete link result:', result);

            // Refresh links after deletion
            if (profileData?.id) {
                const fetchedLinks = await linkService.getLinks(profileData.id);
                setLinks(fetchedLinks);

                // Also refresh the profile data to update the UI
                await fetchProfile();
            }
            setError(null);
        } catch (err: any) {
            console.error('Error deleting link:', err);
            setError(`Error deleting link: ${err.message}`);
        } finally {
            setDeletingLink(false);
            setDeletingLinkId(null);
        }
    };

    return (
        <div className="mt-8 p-4 border rounded">
            <h2 className="font-semibold mb-2">Client Auth Test (Email/Password)</h2>
            {user ? (
                <>
                    <div className="mb-2">Logged in as: <b>{user.email}</b></div>
                    <button onClick={logout} className="px-4 py-2 bg-red-500 text-white rounded">Logout</button>
                    <div className="mt-4">
                        <h3 className="font-semibold">User Data</h3>
                        {loadingProfile && <div>Loading profile...</div>}
                        {error && <div className="text-red-500">{error}</div>}
                        {profileData && (
                            <div className="space-y-4">
                                {/* Profile section (same as before) */}
                                <section>
                                    <h4 className="font-bold">Profile</h4>
                                    {!editing ? (
                                        <div>
                                            <div><b>Full Name:</b> {profileData.fullName || <span className="text-gray-400">None</span>}</div>                                            <div><b>Bio:</b> {profileData.bio || <span className="text-gray-400">None</span>}</div>
                                            <div><b>Tagline:</b> {profileData.tagline || <span className="text-gray-400">None</span>}</div>
                                            <div><b>Image URL:</b> {profileData.image_url || <span className="text-gray-400">None</span>}</div>
                                            <button
                                                className="mt-2 px-3 py-1 bg-blue-500 text-white rounded"
                                                onClick={handleEdit}
                                            >
                                                Edit
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            <div>
                                                <label className="block text-sm font-medium">Full Name</label>
                                                <input
                                                    name="full_name"
                                                    value={editFields.full_name}
                                                    onChange={handleEditChange}
                                                    className="border px-2 py-1 rounded w-full"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium">Bio</label>
                                                <textarea
                                                    name="bio"
                                                    value={editFields.bio}
                                                    onChange={handleEditChange}
                                                    className="border px-2 py-1 rounded w-full"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium">Tagline</label>
                                                <input
                                                    name="tagline"
                                                    value={editFields.tagline}
                                                    onChange={handleEditChange}
                                                    className="border px-2 py-1 rounded w-full"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium">Image URL</label>
                                                <input
                                                    name="image_url"
                                                    value={editFields.image_url}
                                                    onChange={handleEditChange}
                                                    className="border px-2 py-1 rounded w-full"
                                                />
                                            </div>
                                            <div className="flex gap-2 mt-2">
                                                <button
                                                    className="px-3 py-1 bg-green-600 text-white rounded"
                                                    onClick={handleEditSave}
                                                    disabled={saving}
                                                    type="button"
                                                >
                                                    {saving ? 'Saving...' : 'Save'}
                                                </button>
                                                <button
                                                    className="px-3 py-1 bg-gray-400 text-white rounded"
                                                    onClick={handleEditCancel}
                                                    type="button"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </section>
                                {/* Links section */}
                                <section className="mt-6">
                                    <div className="flex justify-between items-center">
                                        <h4 className="font-bold">Links</h4>
                                        <button
                                            className="px-3 py-1 bg-blue-600 text-white text-xs rounded"
                                            onClick={() => setAddingLink(true)}
                                            type="button"
                                        >
                                            Add Link
                                        </button>
                                    </div>
                                    {addingLink && (
                                        <div className="mb-2 flex flex-col gap-2 bg-gray-50 p-2 rounded">
                                            <input
                                                placeholder="Title"
                                                className="border px-2 py-1 rounded"
                                                value={newLink.title}
                                                onChange={e => setNewLink({ ...newLink, title: e.target.value })}
                                            />
                                            <input
                                                placeholder="URL"
                                                className="border px-2 py-1 rounded"
                                                value={newLink.url}
                                                onChange={e => setNewLink({ ...newLink, url: e.target.value })}
                                            />
                                            <select
                                                className="border px-2 py-1 rounded"
                                                value={newLink.type}
                                                onChange={e => setNewLink({ ...newLink, type: e.target.value as 'normal' | 'social' | 'blog' })}
                                            >
                                                <option value="normal">Normal</option>
                                                <option value="social">Social</option>
                                                <option value="blog">Blog</option>
                                            </select>
                                            <div className="flex gap-2">
                                                <button
                                                    className="px-3 py-1 bg-green-600 text-white rounded"
                                                    onClick={handleAddLink}
                                                    disabled={addingLinkLoading}
                                                    type="button"
                                                >
                                                    {addingLinkLoading ? 'Adding...' : 'Add'}
                                                </button>
                                                <button
                                                    className="px-3 py-1 bg-gray-400 text-white rounded"
                                                    onClick={() => setAddingLink(false)}
                                                    type="button"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                    {links && links.length > 0 ? (
                                        <div className="space-y-2 mt-2">
                                            {links.map(link => (
                                                <div key={link.id} className="bg-gray-100 p-2 rounded flex justify-between items-center">
                                                    <div>
                                                        <div className="font-medium">{link.title}</div>
                                                        <div className="text-xs text-gray-600">{link.url}</div>
                                                        <div className="text-xs text-gray-500">Type: {link.type}</div>
                                                    </div>
                                                    <button
                                                        className="px-2 py-1 bg-red-600 text-white text-xs rounded"
                                                        onClick={() => handleDeleteLink(link.id)}
                                                        disabled={deletingLink && deletingLinkId === link.id}
                                                        type="button"
                                                    >
                                                        {deletingLink && deletingLinkId === link.id ? 'Deleting...' : 'Delete'}
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-gray-500">No links found.</div>
                                    )}
                                </section>
                                {/* Blocks section */}
                                <section className="mt-6">
                                    <div className="flex justify-between items-center">
                                        <h4 className="font-bold">Blocks</h4>
                                        <button
                                            className="px-3 py-1 bg-blue-600 text-white text-xs rounded"
                                            onClick={() => setAddingBlock(true)}
                                            type="button"
                                        >
                                            Add Block
                                        </button>
                                    </div>
                                    {addingBlock && (
                                        <div className="mb-2 flex flex-col gap-2 bg-gray-50 p-2 rounded">
                                            <input
                                                placeholder="Type"
                                                className="border px-2 py-1 rounded"
                                                value={newBlock.type}
                                                onChange={e => setNewBlock({ ...newBlock, type: e.target.value })}
                                            />
                                            <textarea
                                                placeholder='Content (JSON)'
                                                className="border px-2 py-1 rounded"
                                                value={newBlock.content}
                                                onChange={e => setNewBlock({ ...newBlock, content: e.target.value })}
                                            />
                                            <div className="flex gap-2">
                                                <button
                                                    className="px-3 py-1 bg-green-600 text-white rounded"
                                                    onClick={handleAddBlock}
                                                    disabled={addingBlockLoading}
                                                    type="button"
                                                >
                                                    {addingBlockLoading ? 'Adding...' : 'Add'}
                                                </button>
                                                <button
                                                    className="px-3 py-1 bg-gray-400 text-white rounded"
                                                    onClick={() => setAddingBlock(false)}
                                                    type="button"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                    {blocks && blocks.length > 0 ? (
                                        <div className="space-y-2 mt-2">
                                            {blocks.map(block => (
                                                <div key={block.id} className="bg-gray-100 p-2 rounded flex justify-between items-center">
                                                    <div>
                                                        <div className="font-medium">Type: {block.type}</div>
                                                        <div className="text-xs text-gray-600 truncate max-w-xs">
                                                            Content: {JSON.stringify(block.content).substring(0, 50)}...
                                                        </div>
                                                    </div>
                                                    <button
                                                        className="px-2 py-1 bg-red-600 text-white text-xs rounded"
                                                        onClick={() => handleDeleteBlock(block.id)}
                                                        disabled={deletingBlock && deletingBlockId === block.id}
                                                        type="button"
                                                    >
                                                        {deletingBlock && deletingBlockId === block.id ? 'Deleting...' : 'Delete'}
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-gray-500">No blocks found.</div>
                                    )}
                                </section>
                                {/* Preferences section */}
                                <section>
                                    <h4 className="font-bold">Preferences</h4>
                                    {profileData.preferences ? (
                                        <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
                                            {JSON.stringify(profileData.preferences, null, 2)}
                                        </pre>
                                    ) : (
                                        <div className="text-gray-500">No preferences found.</div>
                                    )}
                                </section>
                            </div>
                        )}
                    </div>
                </>
            ) : (
                <form onSubmit={handleLogin} className="space-y-2">
                    <input
                        type="email"
                        placeholder="Email"
                        className="border px-2 py-1 rounded w-full"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="border px-2 py-1 rounded w-full"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">Login</button>
                    {error && <div className="text-red-500 mt-2">{error}</div>}
                </form>
            )}
        </div>
    );
}
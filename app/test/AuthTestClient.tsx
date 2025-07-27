'use client';

import { useState, useEffect } from 'react';
import { useSupabase } from '@/components/providers/SupabaseProvider';

export default function AuthTestClient() {
    const { supabase, user, logout } = useSupabase();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [profileData, setProfileData] = useState<any>(null);
    const [loadingProfile, setLoadingProfile] = useState(false);

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
    const [newLink, setNewLink] = useState({
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

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) setError(error.message);
    };

    // Fetch all user data after login
    useEffect(() => {
        const fetchProfile = async () => {
            if (!user) {
                setProfileData(null);
                return;
            }
            setLoadingProfile(true);
            setError(null);
            const username = user.user_metadata?.username;
            if (!username) {
                setError('No username found in user metadata.');
                setLoadingProfile(false);
                return;
            }
            const { data, error } = await supabase
                .from('profiles')
                .select('*, links(*), blocks(*), preferences(*)')
                .eq('username', username)
                .single();
            if (error) setError(error.message);
            setProfileData(data);
            setLoadingProfile(false);
            if (data) {
                setEditFields({
                    full_name: data.full_name || '',
                    bio: data.bio || '',
                    tagline: data.tagline || '',
                    image_url: data.image_url || ''
                });
            }
        };
        fetchProfile();
    }, [user, supabase]);

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
        if (!profileData?.username) return;
        setSaving(true);
        setError(null);
        const { error } = await supabase
            .from('profiles')
            .update({
                full_name: editFields.full_name,
                bio: editFields.bio,
                tagline: editFields.tagline,
                image_url: editFields.image_url
            })
            .eq('username', profileData.username);
        setSaving(false);
        if (error) {
            setError(error.message);
        } else {
            setEditing(false);
            // Refetch profile data
            const { data } = await supabase
                .from('profiles')
                .select('*, links(*), blocks(*), preferences(*)')
                .eq('username', profileData.username)
                .single();
            setProfileData(data);
        }
    };

    // Add Link logic
    const handleAddLink = async () => {
        if (!profileData?.id) return;
        setAddingLinkLoading(true);
        setError(null);
        const { error } = await supabase
            .from('links')
            .insert({
                profile_id: profileData.id,
                title: newLink.title,
                url: newLink.url,
                type: newLink.type
            });
        setAddingLinkLoading(false);
        if (error) {
            setError(error.message);
        } else {
            setAddingLink(false);
            setNewLink({ title: '', url: '', type: 'normal' });
            // Refetch profile data
            const { data } = await supabase
                .from('profiles')
                .select('*, links(*), blocks(*), preferences(*)')
                .eq('username', profileData.username)
                .single();
            setProfileData(data);
        }
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
                                            <div><b>Full Name:</b> {profileData.full_name || <span className="text-gray-400">None</span>}</div>
                                            <div><b>Bio:</b> {profileData.bio || <span className="text-gray-400">None</span>}</div>
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
                                <section>
                                    <h4 className="font-bold flex items-center gap-2">
                                        Links
                                        {!addingLink && (
                                            <button
                                                className="px-2 py-1 bg-blue-500 text-white rounded text-xs"
                                                onClick={() => setAddingLink(true)}
                                                type="button"
                                            >
                                                Add Link
                                            </button>
                                        )}
                                    </h4>
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
                                                onChange={e => setNewLink({ ...newLink, type: e.target.value })}
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
                                    {profileData.links && profileData.links.length > 0 ? (
                                        <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
                                            {JSON.stringify(profileData.links, null, 2)}
                                        </pre>
                                    ) : (
                                        <div className="text-gray-500">No links found.</div>
                                    )}
                                </section>
                                {/* Blocks section */}
                                <section>
                                    <h4 className="font-bold flex items-center gap-2">
                                        Blocks
                                        {!addingBlock && (
                                            <button
                                                className="px-2 py-1 bg-blue-500 text-white rounded text-xs"
                                                onClick={() => setAddingBlock(true)}
                                                type="button"
                                            >
                                                Add Block
                                            </button>
                                        )}
                                    </h4>
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
                                    {profileData.blocks && profileData.blocks.length > 0 ? (
                                        <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
                                            {JSON.stringify(profileData.blocks, null, 2)}
                                        </pre>
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
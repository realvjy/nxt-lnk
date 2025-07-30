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
import { Block, createBlock, blockTypes } from '@/types/app/blocks';
import { Link, SocialPlatform, createLink } from '@/types/app/links';
import { mapBlockFromDb, mapBlockToDb, mapLinkFromDb, mapLinkToDb, mapProfileFromDb } from '@/types/supabase/mappings';
import { useUserStore } from '@/lib/stores/userStore';
import { useBlocksStore } from '@/lib/stores/blocksStore';
import { useLinksStore } from '@/lib/stores/linksStore';
import { useLayoutStore } from '@/lib/stores/layoutStore';
import { usePersistenceStore } from '@/lib/stores/persistenceStore';
import { blockService } from '@/supabase/services/blocks';

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
  const { links: userLinks, isLoading: linksLoading, error: linksError } = useLinks(
    userReady ? user?.id || '' : ''
  );

  // Block form fields
  const [blockText, setBlockText] = useState('');
  const [blockImageUrl, setBlockImageUrl] = useState('');
  const [blockImageAlt, setBlockImageAlt] = useState('');
  const [blockBadgeType, setBlockBadgeType] = useState<'exclusive' | 'live' | 'available' | 'busy' | 'away' | 'offline'>('available');
  const [blockLinkLabel, setBlockLinkLabel] = useState('');
  const [blockLinkUrl, setBlockLinkUrl] = useState('');
  const [blockLinkPlatform, setBlockLinkPlatform] = useState<SocialPlatform>('other');
  // Form states
  const [newLinkPlatform, setNewLinkPlatform] = useState<SocialPlatform>('other');
  const [newLinkPublishDate, setNewLinkPublishDate] = useState('');
  const [newLinkDescription, setNewLinkDescription] = useState('');
  const [newLinkCover, setNewLinkCover] = useState('');

  // In your edit page
  useEffect(() => {
    if (!userReady || !user?.id) return;

    const loadData = async () => {
      // 1. First fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (profileData) {
        setProfile(mapProfileFromDb(profileData));

        // 2. Then fetch blocks and links with profile.id
        const { data: blocksData } = await supabase
          .from('blocks')
          .select('*')
          .eq('profile_id', profileData.id)
          .order('sort_order', { ascending: true });

        const { data: linksData } = await supabase
          .from('links')
          .select('*')
          .eq('profile_id', profileData.id)
          .order('sort_order', { ascending: true });

        // 3. Update stores
        setBlocks((blocksData || []).map(mapBlockFromDb));
        setLinks((linksData || []).map(mapLinkFromDb));
      }
    };

    loadData();
  }, [userReady, user?.id]);
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
      console.log('Starting save operation with profile:', profile);
      console.log('Current blocks:', blocks);
      console.log('Current links:', links);

      // Update profile in database
      if (profile.id) {
        console.log('Updating profile with data:', {
          full_name: profileForm.fullName,
          bio: profileForm.bio,
          tagline: profileForm.tagline,
          image_url: profileForm.imageUrl
        });

        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            full_name: profileForm.fullName,
            bio: profileForm.bio,
            tagline: profileForm.tagline,
            image_url: profileForm.imageUrl
          })
          .eq('id', profile.id);

        if (updateError) {
          console.error('Error updating profile:', updateError);
          throw updateError;
        } else {
          console.log('Profile updated successfully');
        }
      }

      // Save blocks to database
      if (blocks.length > 0 && profile?.id) {
        console.log('Saving blocks for profile ID:', profile.id);

        try {
          // Prepare blocks for upsert with profile_id and sort_order
          const dbBlocks = blocks.map((block, index) => {
            const mappedBlock = mapBlockToDb({
              ...block,
              profileId: profile.id,
              sortOrder: index
            });
            console.log(`Mapped block ${block.id}:`, mappedBlock);
            return mappedBlock;
          });

          // Use upsert to update existing blocks and insert new ones
          console.log('Upserting blocks:', dbBlocks);
          const { error: upsertBlocksError } = await supabase
            .from('blocks')
            .upsert(dbBlocks, {
              onConflict: 'id',
              ignoreDuplicates: false
            });

          if (upsertBlocksError) {
            console.error('Error upserting blocks:', upsertBlocksError);
            throw upsertBlocksError;
          }

          console.log('Blocks upserted successfully');

          // Find blocks that were deleted in the UI but still exist in the database
          const { data: existingBlocks, error: fetchBlocksError } = await supabase
            .from('blocks')
            .select('id')
            .eq('profile_id', profile.id);

          if (fetchBlocksError) {
            console.error('Error fetching existing blocks:', fetchBlocksError);
            throw fetchBlocksError;
          }

          // Find IDs that exist in the database but not in the current blocks array
          if (existingBlocks && existingBlocks.length > 0) {
            const currentBlockIds = blocks.map(block => block.id);
            const blocksToDelete = existingBlocks
              .filter(dbBlock => !currentBlockIds.includes(dbBlock.id))
              .map(block => block.id);

            console.log('Blocks to delete:', blocksToDelete);

            // Delete blocks that were removed in the UI
            if (blocksToDelete.length > 0) {
              const { error: deleteError } = await supabase
                .from('blocks')
                .delete()
                .in('id', blocksToDelete);

              if (deleteError) {
                console.error('Error deleting blocks:', deleteError);
                throw deleteError;
              }

              console.log('Deleted blocks successfully');
            }
          }
        } catch (error) {
          console.error('Error handling blocks:', error);
          throw error;
        }
      } else {
        console.log('No blocks to save or profile ID is missing');
      }

      // Save links to database
      if (links.length > 0 && profile?.id) {
        console.log('Saving links for profile ID:', profile.id);

        // Prepare links for upsert with profile_id and sort_order
        const dbLinks = links.map((link, index) => {
          const mappedLink = mapLinkToDb({
            ...link,
            profileId: profile.id,
            sortOrder: index
          });
          console.log(`Mapped link ${link.id}:`, mappedLink);
          return mappedLink;
        });

        // Use upsert to update existing links and insert new ones
        console.log('Upserting links:', dbLinks);
        const { error: upsertLinksError } = await supabase
          .from('links')
          .upsert(dbLinks, {
            onConflict: 'id',
            ignoreDuplicates: false
          });

        if (upsertLinksError) {
          console.error('Error upserting links:', upsertLinksError);
          throw upsertLinksError;
        }

        console.log('Links upserted successfully');

        // Find links that were deleted in the UI but still exist in the database
        const { data: existingLinks, error: fetchLinksError } = await supabase
          .from('links')
          .select('id')
          .eq('profile_id', profile.id);

        if (fetchLinksError) {
          console.error('Error fetching existing links:', fetchLinksError);
          throw fetchLinksError;
        }

        // Find IDs that exist in the database but not in the current links array
        if (existingLinks && existingLinks.length > 0) {
          const currentLinkIds = links.map(link => link.id);
          const linksToDelete = existingLinks
            .filter(dbLink => !currentLinkIds.includes(dbLink.id))
            .map(link => link.id);

          console.log('Links to delete:', linksToDelete);

          // Delete links that were removed in the UI
          if (linksToDelete.length > 0) {
            const { error: deleteError } = await supabase
              .from('links')
              .delete()
              .in('id', linksToDelete);

            if (deleteError) {
              console.error('Error deleting links:', deleteError);
              throw deleteError;
            }

            console.log('Deleted links successfully');
          }
        }
      } else {
        console.log('No links to save or profile ID is missing');
      }

      // Refresh data after saving
      if (profile?.id) {
        console.log('Refreshing data after save');

        // Refresh blocks
        const { data: refreshedBlocks } = await supabase
          .from('blocks')
          .select('*')
          .eq('profile_id', profile.id);

        if (refreshedBlocks) {
          console.log('Refreshed blocks:', refreshedBlocks);
          setBlocks(refreshedBlocks.map(block => ({
            ...block,
            id: block.id,
            profileId: block.profile_id,
            type: block.type,
            content: block.content,
            settings: block.settings,
            sortOrder: block.sort_order,
            createdAt: block.created_at,
            updatedAt: block.updated_at
          })));
        }

        // Refresh links
        const { data: refreshedLinks } = await supabase
          .from('links')
          .select('*')
          .eq('profile_id', profile.id);

        if (refreshedLinks) {
          console.log('Refreshed links:', refreshedLinks);
          setLinks(refreshedLinks.map(link => ({
            ...link,
            id: link.id,
            profileId: link.profile_id,
            sortOrder: link.sort_order,
            createdAt: link.created_at,
            updatedAt: link.updated_at
          })));
        }
      }

      // Save to localStorage as backup
      await saveToStorage();

      toast.success('Changes saved successfully!');
    } catch (error) {
      console.error('Error saving changes:', error);
      toast.error(`Failed to save changes: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
  const handleAddBlock = async () => {
    if (!profile?.id) {
      toast.error('Profile not loaded yet. Please wait.')
      return
    }
    // Debug logs
    console.log('Adding block with profile ID:', profile.id);
    console.log('Current user ID:', user?.id);
    console.log('Profile user ID:', profile.id);
    // 1) initial content by type (your switch is fine)
    let initialContent: any = {}
    switch (newBlockType) {
      case 'paragraph': initialContent = { text: '' }; break
      case 'image': initialContent = { url: '', alt: '' }; break
      case 'badge': initialContent = { type: 'available', text: 'Available' }; break
      case 'name': initialContent = { text: profile.fullName || '' }; break
      case 'tagline': initialContent = { text: profile.tagline || '' }; break
      case 'bio': initialContent = { text: profile.bio || '' }; break
      default: initialContent = {}
    }

    // 2) compute next sort order
    const nextOrder = (blocks?.length ?? 0)
    console.log('Next order:', nextOrder, newBlockType);
    // 3) create a transient block (for mapping convenience)
    const draft = createBlock(newBlockType, {
      profileId: profile.id,
      content: initialContent,
      sortOrder: nextOrder,
    })

    try {
      // 4) insert into DB
      const payload = mapBlockToDb(draft)                       // -> DB shape (no id)
      const { data, error } = await supabase
        .from('blocks')
        .insert(payload)
        .select('*')
        .single()

      if (error) throw error

      // 5) map saved row -> app Block (has id, timestamps)
      const saved = mapBlockFromDb(data)

      // 6) update store WITHOUT calling addBlock (to avoid the Omit<...> type)
      setBlocks([...(blocks ?? []), saved])

      // 7) open editor on the SAVED block (has real id)
      setEditingBlock(saved)

      toast.success(`Added new ${newBlockType} block`)
    } catch (err) {
      console.error('Error adding block:', err)
      toast.error('Failed to add block')
    }
  }

  // Add a new link
  // Add a new link
  // Add a new link
  const handleAddLink = async () => {
    if (!profile?.id) {
      toast.error('Profile not loaded yet. Please wait.');
      return;
    }
    if (!newLinkUrl || !newLinkTitle) {
      toast.error('Please enter both URL and title for the link');
      return;
    }

    try {
      // Create the link object
      const newLink = createLink(newLinkType, {
        profileId: profile.id,
        url: newLinkUrl,
        title: newLinkTitle,
        sortOrder: links?.length ?? 0
      });

      // Map to database format
      const payload = mapLinkToDb(newLink);

      // Insert into database
      const { data, error } = await supabase
        .from('links')
        .insert(payload)
        .select('*')
        .single();

      if (error) throw error;

      // Map the returned data back to app format
      const savedLink = mapLinkFromDb(data) as Link;

      // Update the store with the saved link (with real ID)
      setLinks([...(links ?? []), savedLink]);

      // Reset form
      setNewLinkUrl('');
      setNewLinkTitle('');
      toast.success('Link added successfully');
    } catch (err) {
      console.error('Error adding link:', err);
      toast.error('Failed to add link');
    }
  };
  // Reset form fields when block type changes
  useEffect(() => {
    setBlockText('');
    setBlockImageUrl('');
    setBlockImageAlt('');
    setBlockBadgeType('available');
    setBlockLinkLabel('');
    setBlockLinkUrl('');
    setBlockLinkPlatform('other');
  }, [newBlockType]);
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
  const handleAddBlockWithData = async () => {
    if (!profile?.id) {
      toast.error('Profile not loaded yet. Please wait.')
      return
    }

    // Prepare initial content based on block type
    let initialContent: any = {};

    switch (newBlockType) {
      case 'paragraph':
      case 'name':
      case 'tagline':
      case 'bio':
      case 'label':
        initialContent = { text: blockText };
        break;
      case 'image':
        initialContent = { url: blockImageUrl, alt: blockImageAlt };
        break;
      case 'badge':
        initialContent = { type: blockBadgeType, text: blockText };
        break;
      case 'link':
        initialContent = {
          label: blockLinkLabel,
          url: blockLinkUrl,
          platform: blockLinkPlatform,
        };
        break;
      default:
        initialContent = {};
    }

    // Create and save the block
    const nextOrder = (blocks?.length ?? 0);
    const draft = createBlock(newBlockType, {
      profileId: profile.id,
      content: initialContent,
      sortOrder: nextOrder,
    });

    try {
      const payload = mapBlockToDb(draft);
      const { data, error } = await supabase
        .from('blocks')
        .insert(payload)
        .select('*')
        .single();

      if (error) throw error;

      const saved = mapBlockFromDb(data);
      setBlocks([...(blocks ?? []), saved]);

      // Reset form fields
      setBlockText('');
      setBlockImageUrl('');
      setBlockImageAlt('');
      setBlockBadgeType('available');
      setBlockLinkLabel('');
      setBlockLinkUrl('');
      setBlockLinkPlatform('other');

      toast.success(`Added new ${newBlockType} block`);
    } catch (err) {
      console.error('Error adding block:', err);
      toast.error('Failed to add block');
    }
  };
  // Render blocks tab
  const renderBlocksTab = () => {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Add New Block</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="block-type">Block Type</Label>
              <select
                id="block-type"
                className="w-full p-2 border rounded"
                value={newBlockType}
                onChange={(e) => setNewBlockType(e.target.value as Block['type'])}
              >
                {blockTypes.map(type => (
                  <option key={type.type} value={type.type}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Text-based blocks */}
            {(newBlockType === 'paragraph' || newBlockType === 'name' ||
              newBlockType === 'tagline' || newBlockType === 'bio' ||
              newBlockType === 'label') && (
                <div>
                  <Label htmlFor="block-text">Text</Label>
                  {newBlockType === 'paragraph' || newBlockType === 'bio' ? (
                    <Textarea
                      id="block-text"
                      value={blockText}
                      onChange={(e) => setBlockText(e.target.value)}
                      placeholder={`Enter ${newBlockType} text...`}
                      rows={4}
                    />
                  ) : (
                    <Input
                      id="block-text"
                      value={blockText}
                      onChange={(e) => setBlockText(e.target.value)}
                      placeholder={`Enter ${newBlockType} text...`}
                    />
                  )}
                </div>
              )}

            {/* Image block */}
            {newBlockType === 'image' && (
              <>
                <div>
                  <Label htmlFor="block-image-url">Image URL</Label>
                  <Input
                    id="block-image-url"
                    value={blockImageUrl}
                    onChange={(e) => setBlockImageUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div>
                  <Label htmlFor="block-image-alt">Alt Text</Label>
                  <Input
                    id="block-image-alt"
                    value={blockImageAlt}
                    onChange={(e) => setBlockImageAlt(e.target.value)}
                    placeholder="Image description"
                  />
                </div>
              </>
            )}

            {/* Badge block */}
            {newBlockType === 'badge' && (
              <>
                <div>
                  <Label htmlFor="block-badge-type">Badge Type</Label>
                  <select
                    id="block-badge-type"
                    className="w-full p-2 border rounded"
                    value={blockBadgeType}
                    onChange={(e) => setBlockBadgeType(e.target.value as any)}
                  >
                    <option value="available">Available</option>
                    <option value="busy">Busy</option>
                    <option value="away">Away</option>
                    <option value="offline">Offline</option>
                    <option value="exclusive">Exclusive</option>
                    <option value="live">Live</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="block-badge-text">Badge Text (Optional)</Label>
                  <Input
                    id="block-badge-text"
                    value={blockText}
                    onChange={(e) => setBlockText(e.target.value)}
                    placeholder="Custom badge text (optional)"
                  />
                </div>
              </>
            )}

            {/* Link block */}
            {newBlockType === 'link' && (
              <>
                <div>
                  <Label htmlFor="block-link-label">Link Label</Label>
                  <Input
                    id="block-link-label"
                    value={blockLinkLabel}
                    onChange={(e) => setBlockLinkLabel(e.target.value)}
                    placeholder="Display text for link"
                  />
                </div>
                <div>
                  <Label htmlFor="block-link-url">Link URL</Label>
                  <Input
                    id="block-link-url"
                    value={blockLinkUrl}
                    onChange={(e) => setBlockLinkUrl(e.target.value)}
                    placeholder="https://example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="block-link-platform">Platform (Optional)</Label>
                  <select
                    id="block-link-platform"
                    className="w-full p-2 border rounded"
                    value={blockLinkPlatform}
                    onChange={(e) => setBlockLinkPlatform(e.target.value as SocialPlatform)}
                  >
                    <option value="twitter">Twitter</option>
                    <option value="instagram">Instagram</option>
                    <option value="facebook">Facebook</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="github">GitHub</option>
                    <option value="youtube">YouTube</option>
                    <option value="tiktok">TikTok</option>
                    <option value="dribbble">Dribbble</option>
                    <option value="behance">Behance</option>
                    <option value="twitch">Twitch</option>
                    <option value="medium">Medium</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </>
            )}

            <Button onClick={handleAddBlockWithData}>Add Block</Button>
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
                        onClick={async () => {
                          try {
                            // Delete from database first
                            if (block.id) {
                              console.log('Deleting block with ID:', block.id);

                              // Use the block service directly
                              const result = await blockService.deleteBlock(block.id);
                              console.log('Delete block service result:', result);

                              // Verify deletion by checking if the block still exists
                              const { data: checkData } = await supabase
                                .from('blocks')
                                .select('*')
                                .eq('id', block.id);

                              if (checkData && checkData.length > 0) {
                                console.log('Block still exists after deletion attempt. Trying direct Supabase call...');

                                // If block still exists, try direct deletion as fallback
                                const { error: directError } = await supabase
                                  .from('blocks')
                                  .delete()
                                  .eq('id', block.id);

                                if (directError) {
                                  console.error('Direct deletion error:', directError);
                                  toast.error(`Failed to delete block: ${directError.message}`);
                                  return;
                                }

                                console.log('Block deleted via direct Supabase call');
                              } else {
                                console.log('Block successfully deleted');
                              }

                              // Update UI state
                              deleteBlock(block.id);

                              // Refresh blocks from database
                              if (profile?.id) {
                                const fetchedBlocks = await blockService.getBlocks(profile.id);
                                setBlocks(fetchedBlocks);
                                toast.success('Block deleted');
                              }
                            } else {
                              // For blocks not yet saved to database
                              deleteBlock(block.id);
                              toast.success('Block deleted');
                            }
                          } catch (error) {
                            console.error('Error in block deletion:', error);
                            toast.error('An error occurred while deleting the block');
                          }
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
                  {block.type === 'paragraph' && (
                    <div>
                      <p className="font-semibold">Paragraph:</p>
                      <p className="text-sm line-clamp-3">{block.content?.text}</p>
                    </div>
                  )}
                  {block.type === 'link' && (
                    <div>
                      <p>Label: {block.content?.label}</p>
                      <p>URL: {block.content?.url}</p>
                    </div>
                  )}
                  {block.type === 'image' && (
                    <div>
                      <p>URL: {block.content?.url}</p>
                      <p>Alt: {block.content?.alt}</p>
                      {block.content?.url && (
                        <img
                          src={block.content.url}
                          alt={block.content.alt || "Image"}
                          className="mt-2 max-h-24 object-contain"
                        />
                      )}
                    </div>
                  )}
                  {block.type === 'badge' && (
                    <div>
                      <p>Text: {block.content?.text}</p>
                      <p>Type: {block.content?.type}</p>
                      {block.content?.type && (
                        <div className="mt-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${block.content.type === 'available' ? 'bg-green-500 text-white' :
                            block.content.type === 'busy' ? 'bg-yellow-500 text-white' :
                              block.content.type === 'away' ? 'bg-gray-500 text-white' :
                                block.content.type === 'offline' ? 'bg-red-500 text-white' :
                                  block.content.type === 'live' ? 'bg-red-500 text-white' :
                                    'bg-purple-500 text-white'
                            }`}>
                            {block.content.text || block.content.type}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Block Editor Modal */}
        {editingBlock && editingBlock.type === 'badge' && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="badge-text">Badge Text</Label>
              <Input
                id="badge-text"
                value={editingBlock.content?.text || ''}
                onChange={(e) => setEditingBlock({
                  ...editingBlock,
                  content: { ...editingBlock.content, text: e.target.value }
                })}
                placeholder="Available, Busy, etc."
              />
            </div>
            <div>
              <Label htmlFor="badge-type">Badge Type</Label>
              <select
                id="badge-type"
                className="w-full p-2 border rounded"
                value={editingBlock.content?.type || 'available'}
                onChange={(e) => setEditingBlock({
                  ...editingBlock,
                  content: {
                    ...editingBlock.content,
                    type: e.target.value as 'exclusive' | 'live' | 'available' | 'busy' | 'away' | 'offline'
                  }
                })}
              >
                <option value="available">Available</option>
                <option value="busy">Busy</option>
                <option value="away">Away</option>
                <option value="offline">Offline</option>
                <option value="live">Live</option>
                <option value="exclusive">Exclusive</option>
              </select>
            </div>
          </div>
        )}

        {editingBlock && editingBlock.type === 'paragraph' && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="paragraph-text">Paragraph Text</Label>
              <textarea
                id="paragraph-text"
                className="w-full p-2 border rounded min-h-[150px]"
                value={editingBlock.content?.text || ''}
                onChange={(e) => setEditingBlock({
                  ...editingBlock,
                  content: { ...editingBlock.content, text: e.target.value }
                })}
                placeholder="Enter your paragraph text here..."
              />
            </div>
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
                placeholder="Display name for your link"
              />
            </div>
            <div>
              <Label htmlFor="link-url">URL</Label>
              <Input
                id="link-url"
                value={newLinkUrl}
                onChange={(e) => setNewLinkUrl(e.target.value)}
                placeholder="https://example.com"
              />
            </div>

            {/* Additional fields based on link type */}
            {newLinkType === 'social' && (
              <div>
                <Label htmlFor="link-platform">Platform</Label>
                <select
                  id="link-platform"
                  className="w-full p-2 border rounded"
                  value={newLinkPlatform || 'other'}
                  onChange={(e) => setNewLinkPlatform(e.target.value as SocialPlatform)}
                >
                  <option value="twitter">Twitter</option>
                  <option value="instagram">Instagram</option>
                  <option value="facebook">Facebook</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="github">GitHub</option>
                  <option value="youtube">YouTube</option>
                  <option value="tiktok">TikTok</option>
                  <option value="dribbble">Dribbble</option>
                  <option value="behance">Behance</option>
                  <option value="twitch">Twitch</option>
                  <option value="medium">Medium</option>
                  <option value="other">Other</option>
                </select>
              </div>
            )}

            {newLinkType === 'blog' && (
              <div>
                <Label htmlFor="link-publish-date">Publish Date</Label>
                <Input
                  id="link-publish-date"
                  type="date"
                  value={newLinkPublishDate || ''}
                  onChange={(e) => setNewLinkPublishDate(e.target.value)}
                />
              </div>
            )}

            {/* Optional fields for all link types */}
            <div>
              <Label htmlFor="link-description">Description (Optional)</Label>
              <Textarea
                id="link-description"
                value={newLinkDescription || ''}
                onChange={(e) => setNewLinkDescription(e.target.value)}
                placeholder="Short description about this link"
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="link-cover">Cover Image URL (Optional)</Label>
              <Input
                id="link-cover"
                value={newLinkCover || ''}
                onChange={(e) => setNewLinkCover(e.target.value)}
                placeholder="https://example.com/image.jpg"
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
                        onClick={async () => {
                          try {
                            // Delete from database first
                            if (link.id) {
                              console.log('Deleting link with ID:', link.id);

                              // Use the supabase client directly since we don't have linkService imported
                              const { error } = await supabase
                                .from('links')
                                .delete()
                                .eq('id', link.id);

                              if (error) {
                                console.error('Error deleting link:', error);
                                toast.error('Failed to delete link');
                                return;
                              }

                              console.log('Link deleted successfully from database');
                            }

                            // Delete from UI state
                            deleteLink(link.id);
                            toast.success('Link deleted');
                          } catch (error) {
                            console.error('Error in link deletion:', error);
                            toast.error('An error occurred while deleting the link');
                          }
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
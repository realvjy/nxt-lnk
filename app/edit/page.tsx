'use client'
import React, { useState, useEffect } from 'react';
import { useSupabase } from '@/components/providers/SupabaseProvider';
import { useBlocks } from '@/hooks/supabase/useBlocks';
import Navbar from '@/components/layout/Navbar';
import BlockLibrary from '@/components/edit/BlockLibrary';
import EditorPanel from '@/components/edit/EditorPanel';
import DragAndDrop from '@/components/edit/DragAndDrop';
import { Button } from '@/components/ui/button';
import { useLinks } from '@/hooks/supabase/useLinks';
import { useProfile } from '@/hooks/supabase/useProfile';
import { usePreferences } from '@/hooks/supabase/usePreferences';
import { BadgeBlockView, BioBlockView, ImageBlockView, LinkBlockView, NameBlockView, TaglineBlockView } from '@/components/blocks/views';
import { BlockSourceType, isBlogLink, isSocialLink } from '@/shared/index';
import { UnifiedBlock } from '@/shared/app/blocks'; // <-- Add this import

const EditPage: React.FC = () => {
    const { user, supabase } = useSupabase();
    const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(true);
    const [isSaving, setIsSaving] = useState(false);



    // Debugging: Log the user ID
    useEffect(() => {
        console.log('EditPage User ID:', user?.id);
    }, [user]);

    // Only call useBlocks when user ID is available



    const { blocks, isLoading: blocksLoading, error: blocksError, updateBlock, deleteBlock, reorderBlocks } = useBlocks(user?.id);
    const { links, loading: linksLoading, error: linksError } = useLinks(user?.id);
    const { profile, loading, error } = useProfile({ id: user?.id, username: user?.user_metadata?.username });
    console.log('profile', profile);
    console.log('links', links);
    console.log('blocks', blocks);
    if (!user?.id) {
        return <div className="flex items-center justify-center h-screen">Loading...</div>;
    }

    const handleSave = async () => {
        setIsSaving(true);
        try {
            // Implement save logic here
            console.log('Saving changes...');
            // Simulate save delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            console.log('Changes saved successfully.');
        } catch (error) {
            console.error('Error saving changes:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handlePreview = () => {
        setIsEditing(false);
    };

    // const unifiedBlocks: UnifiedBlock[] = [
    //     ...blocks.map(block => ({
    //         ...block,
    //         sourceType: 'block' as const,
    //     })),
    //     ...links.map(link => ({
    //         id: link.id,
    //         type: 'link',
    //         sourceType: 'link' as const,
    //         content: link,
    //         sortOrder: link.sortOrder,
    //         profileId: link.profileId,
    //     })),

    // ];
    return (
        <div className="flex flex-col h-screen">
            <Navbar />
            {/* {links.map(link => (
                <LinkBlockView
                    key={link.id}
                    block={{
                        id: link.id,
                        type: 'link',
                        profileId: link.profileId,
                        sortOrder: link.sortOrder,
                        content: {
                            label: link.label || link.title,
                            url: link.url,
                            linkType: link.type,
                            platform: isSocialLink(link) ? link.platform : undefined,
                            cover: isBlogLink(link) ? link.cover : undefined,
                            // ...other fields as needed
                        }
                    }}
                    isEditing={isEditing}
                    onChange={updatedBlock => updateBlock(updatedBlock.id, updatedBlock)}
                />
            ))} */}

            <div className="flex flex-1 overflow-hidden">
                <aside className="flex-none w-64 bg-gray-200 p-4 overflow-y-auto">
                    {/* <BlockLibrary addBlock={addBlock} /> */}
                </aside>
                <main className="flex-1 p-4 overflow-y-auto">
                    <DragAndDrop
                        blocks={blocks}
                        updateBlock={updateBlock}
                        deleteBlock={deleteBlock}
                        duplicateBlock={updateBlock}
                        reorderBlocks={reorderBlocks}
                        selectedBlockId={selectedBlockId}
                        setSelectedBlockId={setSelectedBlockId}
                    />
                </main>
                <aside className="flex-none w-64 bg-gray-200 p-4 overflow-y-auto">
                    <EditorPanel
                        blockId={selectedBlockId}
                        updateBlock={(updatedBlock) => updateBlock(updatedBlock.id, updatedBlock)} // ✅ Adapter function
                        deleteBlock={deleteBlock}
                        duplicateBlock={(block) => updateBlock(block.id, block)}
                    />
                </aside>
            </div>
            <footer className="flex-none p-4 bg-gray-100 flex justify-end space-x-2">
                <Button
                    className={`px-4 py-2 rounded ${isSaving ? 'bg-gray-400' : 'bg-blue-500'} text-white`}
                    onClick={handleSave}
                    disabled={isSaving}
                >
                    {isSaving ? 'Saving...' : 'Save'}
                </Button>
                <Button
                    className="px-4 py-2 bg-green-500 text-white rounded"
                    onClick={handlePreview}
                >
                    Preview
                </Button>
            </footer>
        </div>
    );
};

export default EditPage;
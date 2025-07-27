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



    const { blocks, isLoading: blocksLoading, error: blocksError } = useBlocks(user?.id);
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

    return (
        <div className="flex flex-col h-screen">
            <Navbar />
            {/* <div className="flex flex-1 overflow-hidden">
                <aside className="flex-none w-64 bg-gray-200 p-4 overflow-y-auto">
                    <BlockLibrary addBlock={addBlock} />
                </aside>
                <main className="flex-1 p-4 overflow-y-auto">
                    <DragAndDrop
                        blocks={blocks}
                        updateBlock={updateBlock}
                        deleteBlock={deleteBlock}
                        duplicateBlock={duplicateBlock}
                        reorderBlocks={reorderBlocks}
                        selectedBlockId={selectedBlockId}
                        setSelectedBlockId={setSelectedBlockId}
                    />
                </main>
                <aside className="flex-none w-64 bg-gray-200 p-4 overflow-y-auto">
                    <EditorPanel
                        blockId={selectedBlockId}
                        updateBlock={updateBlock}
                        deleteBlock={deleteBlock}
                        duplicateBlock={duplicateBlock}
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
            </footer> */}
        </div>
    );
};

export default EditPage;
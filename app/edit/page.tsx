'use client'

import React, { useState } from 'react';
import { useAuth } from '@/hooks/supabase/useAuth';
import { useBlocks } from '@/hooks/supabase/useBlocks';
import { useLinks } from '@/hooks/supabase/useLinks';
import Navbar from '@/components/layout/Navbar';
import BlockLibrary from '@/components/edit/BlockLibrary';
import ProfileSettings from '@/components/edit/ProfileSettings';
import EditorPanel from '@/components/edit/EditorPanel';
import DragAndDrop from '@/components/edit/DragAndDrop';
import CenterPanel from '@/components/edit/CenterPanel'; // New component for center panel

const EditPage: React.FC = () => {
    const { user, isLoading } = useAuth();
    const { blocks, addBlock, updateBlock, deleteBlock, duplicateBlock, reorderBlocks } = useBlocks(user?.id);
    const { links } = useLinks(user?.id);
    const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(true);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar title="Profile Builder" subtitle={`Editing ${user?.username}'s profile`} showBackButton={true} />
            <div className="container mx-auto px-4 py-6">
                <div className="flex items-center justify-between mb-6">
                    <button onClick={() => setIsEditing(!isEditing)}>
                        {isEditing ? 'Preview' : 'Edit'}
                    </button>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left Panel */}
                    <div className="lg:col-span-3">
                        {isEditing && <BlockLibrary addBlock={addBlock} />}
                    </div>

                    {/* Center Panel */}
                    <div className="lg:col-span-6">
                        <CenterPanel onAddBlock={addBlock} />
                        <DragAndDrop
                            blocks={blocks}
                            updateBlock={updateBlock}
                            deleteBlock={deleteBlock}
                            duplicateBlock={duplicateBlock}
                            reorderBlocks={reorderBlocks}
                            selectedBlockId={selectedBlockId}
                            setSelectedBlockId={setSelectedBlockId}
                        />
                    </div>

                    {/* Right Panel */}
                    <div className="lg:col-span-3">
                        {isEditing && selectedBlockId && <EditorPanel blockId={selectedBlockId} />}
                        {isEditing && <ProfileSettings />}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditPage;
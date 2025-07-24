'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BlockRenderer } from '@/components/blocks/BlockRenderer';
import { Edit, Share2, Heart, ExternalLink } from 'lucide-react';
import type { Block } from '@/shared/blocks';
import { useUserStore } from '@/lib/stores/userStore';
import { useLayoutStore } from '@/lib/stores/layoutStore';
import { useSupabase } from '@/components/providers/SupabaseProvider';
import { useRouter } from 'next/navigation';

interface ProfileContentProps {
    initialProfile: any;
}

const ProfileContent: React.FC<ProfileContentProps> = ({ initialProfile }) => {
    const router = useRouter();
    const { supabase } = useSupabase();
    const [profile, setProfile] = useState(initialProfile);
    const [loading, setLoading] = useState(false);

    // Empty handlers for BlockRenderer in view mode
    const noopHandler = () => { };

    // Share functionality
    const handleShare = async () => {
        const shareData = {
            title: `${profile.full_name || profile.username} | Next-Lnks`,
            text: profile.tagline || `Check out ${profile.username}'s links`,
            url: window.location.href,
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(window.location.href);
                // You might want to show a toast notification here
                console.log('Link copied to clipboard');
            }
        } catch (error) {
            console.error('Error sharing:', error);
        }
    };

    const handleEdit = () => {
        router.push('/edit');
    };

    // Check if current user owns this profile
    const [isOwner, setIsOwner] = useState(false);

    useEffect(() => {
        const checkOwnership = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setIsOwner(user?.id === profile.user_id);
        };
        checkOwnership();
    }, [profile.user_id, supabase]);

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">Loading profile...</div>;
    }

    return (
        <>
            <main className="min-h-screen bg-background">
                <div className="container max-w-4xl mx-auto px-4 py-8">
                    <div className="space-y-8">
                        {/* Header with Edit/Share buttons */}
                        <div className="flex justify-end gap-2">
                            {isOwner && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleEdit}
                                    className="gap-2"
                                >
                                    <Edit className="w-4 h-4" />
                                    Edit
                                </Button>
                            )}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleShare}
                                className="gap-2"
                            >
                                <Share2 className="w-4 h-4" />
                                Share
                            </Button>
                        </div>

                        {/* Profile Content */}
                        <div className="space-y-6 animate-fade-in">
                            {profile.layout?.map((block: Block, index: number) => (
                                <BlockRenderer
                                    key={block.id}
                                    block={block}
                                    isEditing={false}
                                    isSelected={false}
                                    isDragging={false}
                                    onUpdate={noopHandler}
                                    onDelete={noopHandler}
                                    onDuplicate={noopHandler}
                                    onSelect={noopHandler}
                                    onAddBlock={noopHandler}
                                />
                            ))}
                        </div>

                        {/* Footer */}
                        <footer className="mt-12 py-8 text-center border-t">
                            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                                <span>Created with</span>
                                <Heart className="w-4 h-4 text-red-500" />
                                <span>using Next-Lnks</span>
                            </div>
                        </footer>
                    </div>
                </div>
            </main>

            {/* Add custom styles for animations */}
            <style jsx>{`
                @keyframes fade-in {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .animate-fade-in {
                    animation: fade-in 0.6s ease-out forwards;
                    opacity: 0;
                }
            `}</style>
        </>
    );
};

export default ProfileContent;

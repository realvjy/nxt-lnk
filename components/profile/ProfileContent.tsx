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
import { getCompleteUserProfile } from '@/lib/constants/testData';

interface ProfileContentProps {
    username: string;
}

const ProfileContent: React.FC<ProfileContentProps> = ({ username }) => {
    const [userData, setUserData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [usingMockData, setUsingMockData] = useState(false);

    useEffect(() => {
        // Function to load data from localStorage first, then fall back to mock data
        const loadUserData = () => {
            setLoading(true);

            try {
                // Check if we have real data in localStorage for this username
                const layoutKey = `user:${username}:layout`;
                const savedLayout = localStorage.getItem(layoutKey);

                if (savedLayout) {
                    // We have real user data!
                    const layout = JSON.parse(savedLayout);

                    // Try to get user profile data
                    const userDataKey = `user-data`;
                    const savedUserData = localStorage.getItem(userDataKey);
                    let profile = {
                        fullName: username,
                        tagline: '',
                        bio: '',
                        image: undefined,
                        badge: undefined
                    };

                    if (savedUserData) {
                        const parsedUserData = JSON.parse(savedUserData);
                        // Only use this data if it's for the same username
                        if (parsedUserData.state?.username === username) {
                            profile = parsedUserData.state.profile;
                        }
                    }

                    // Create our own userData object from localStorage
                    setUserData({
                        profile,
                        blocks: layout,
                        links: { links: [] }, // We don't have separate links storage yet
                        preferences: { theme: 'light' } // Default preferences
                    });
                    setUsingMockData(false);
                } else {
                    // No real data, fall back to mock data
                    const mockData = getCompleteUserProfile(username);
                    setUserData(mockData);
                    setUsingMockData(true);
                }
            } catch (error) {
                console.error('Error loading user data:', error);
                // Fall back to mock data on error
                const mockData = getCompleteUserProfile(username);
                setUserData(mockData);
                setUsingMockData(true);
            } finally {
                setLoading(false);
            }
        };

        loadUserData();
    }, [username]);

    // If still loading or no data, show loading state
    if (loading || !userData) {
        return <div className="flex items-center justify-center min-h-screen">Loading profile...</div>;
    }

    const { profile, blocks } = userData;

    // Check if current user owns this profile
    // In a real app, check authentication
    const currentUsername = useUserStore.getState().username;
    const isOwner = currentUsername === username;

    // Empty handlers for BlockRenderer in view mode
    const noopHandler = () => { };

    // Share functionality
    const handleShare = async () => {
        const shareData = {
            title: `${profile.fullName || username} | Next-Lnks`,
            text: profile.tagline || `Check out ${profile.fullName || username}'s profile`,
            url: window.location.href,
        };

        if (navigator.share && navigator.canShare(shareData)) {
            try {
                await navigator.share(shareData);
            } catch (error) {
                // Fallback to clipboard
                navigator.clipboard.writeText(window.location.href);
            }
        } else {
            // Fallback to clipboard
            navigator.clipboard.writeText(window.location.href);
            // You could show a toast notification here
        }
    };

    const handleEdit = () => {
        window.location.href = '/edit';
    };

    return (
        <>
            {/* Header with actions */}
            <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">@{username}</span>
                                {profile.badge && (
                                    <Badge variant="secondary" className="text-xs">
                                        {profile.badge}
                                    </Badge>
                                )}
                            </div>
                            {usingMockData && (
                                <Badge variant="outline" className="text-xs bg-yellow-100">
                                    Mock Data
                                </Badge>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleShare}
                            >
                                <Share2 className="w-4 h-4 mr-2" />
                                Share
                            </Button>

                            {isOwner && (
                                <Button
                                    size="sm"
                                    onClick={handleEdit}
                                >
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit Profile
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Main content */}
            <main className="min-h-screen bg-background">
                <div className="container mx-auto px-4 py-8">
                    <div className="max-w-2xl mx-auto">
                        {blocks && blocks.length > 0 ? (
                            <div className="space-y-6">
                                {blocks.map((block: Block, index: number) => (
                                    <div
                                        key={block.id}
                                        className="animate-fade-in"
                                        style={{ animationDelay: `${index * 0.1}s` }}
                                    >
                                        <BlockRenderer
                                            block={block}
                                            isEditing={false}
                                            isSelected={false}
                                            onUpdate={noopHandler}
                                            onDelete={noopHandler}
                                            onDuplicate={noopHandler}
                                            onSelect={noopHandler}
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <h3 className="text-xl font-medium">No content yet</h3>
                                <p className="text-muted-foreground mt-2">
                                    This profile doesn't have any content yet.
                                </p>
                            </div>
                        )}

                        {/* Links section - only show if using mock data with links */}
                        {usingMockData && userData.links && userData.links.links && userData.links.links.length > 0 && (
                            <div className="mt-8">
                                <h3 className="text-lg font-medium mb-4">Links</h3>
                                <div className="space-y-3">
                                    {userData.links.links.map((link: any) => (
                                        <a
                                            key={link.id}
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block no-underline"
                                        >
                                            <Card className="hover:shadow-md transition-shadow">
                                                <CardContent className="p-4">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-xl">
                                                                {link.type === 'social' ? '🔗' :
                                                                    link.type === 'blog' ? '📝' : '🌐'}
                                                            </span>
                                                            <div className="flex-1">
                                                                <div className="font-medium">{link.label}</div>
                                                                {link.type === 'social' && 'platform' in link && (
                                                                    <div className="text-sm text-muted-foreground capitalize">
                                                                        {link.platform}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <ExternalLink className="w-4 h-4 text-muted-foreground" />
                                                    </div>

                                                    {link.type === 'blog' && 'cover' in link && link.cover && (
                                                        <div className="mt-3">
                                                            <img
                                                                src={link.cover}
                                                                alt={link.label}
                                                                className="w-full h-32 object-cover rounded-md"
                                                            />
                                                        </div>
                                                    )}
                                                </CardContent>
                                            </Card>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}

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

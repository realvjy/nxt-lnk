'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Edit, Share2, Heart } from 'lucide-react';
import { useSupabase } from '@/components/providers/SupabaseProvider';
import { useRouter } from 'next/navigation';
import { Block } from '@/types/app/blocks';
import { Link } from '@/types/app/links';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

interface ProfileContentProps {
    initialProfile: any;
}

const ProfileContent: React.FC<ProfileContentProps> = ({ initialProfile }) => {
    const router = useRouter();
    const { supabase } = useSupabase();
    const [profile, setProfile] = useState<any>(initialProfile);
    const [blocks, setBlocks] = useState<Block[]>(initialProfile?.blocks || []);
    const [links, setLinks] = useState<Link[]>(initialProfile?.links || []);
    const [loading, setLoading] = useState(false);

    // Empty handlers for view mode
    const noopHandler = () => { };

    console.log('Blocks:', blocks);
    console.log('Links:', links);
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

    // Group links by type
    const socialLinks = links.filter(link => link.type === 'social');
    const blogLinks = links.filter(link => link.type === 'blog');
    const normalLinks = links.filter(link => link.type === 'normal');

    // Helper function to extract text content from a block
    const getBlockText = (block: Block): string => {
        if (!block.content) return '';

        // Use type assertion to access content safely
        const content = block.content as Record<string, any>;

        // Check for standard text property
        if (typeof content.text === 'string') {
            return content.text;
        }

        // Special case for link blocks
        if (block.type === 'link' && typeof content.label === 'string') {
            return content.label;
        }

        // Look for any string property in content
        for (const key in content) {
            if (typeof content[key] === 'string' && key !== 'url' && key !== 'alt' && key !== 'type') {
                return content[key];
            }
        }

        return '';
    };

    // Render block content based on type
    const renderBlock = (block: Block) => {
        switch (block.type) {
            case 'name':
                return (
                    <div key={block.id} className="text-center py-2">
                        <h2 className="text-2xl font-bold">{getBlockText(block)}</h2>
                    </div>
                );
            case 'tagline':
                return (
                    <div key={block.id} className="text-center py-2">
                        <p className="text-lg text-muted-foreground">{getBlockText(block)}</p>
                    </div>
                );
            case 'bio':
                return (
                    <div key={block.id} className="py-2 prose dark:prose-invert max-w-none">
                        <div dangerouslySetInnerHTML={{ __html: getBlockText(block) }} />
                    </div>
                );
            case 'paragraph':
                return (
                    <div key={block.id} className="py-2">
                        <p className="text-base">{getBlockText(block)}</p>
                    </div>
                );
            case 'label':
                return (
                    <div key={block.id} className="py-2">
                        <h3 className="text-lg font-semibold">{getBlockText(block)}</h3>
                    </div>
                );
            case 'image':
                return (
                    <div key={block.id} className="py-2 flex justify-center">
                        {block.content?.url && (
                            <div className="relative w-full aspect-[16/9] overflow-hidden rounded-lg">
                                <Image
                                    src={block.content.url}
                                    alt={block.content.alt || "Block image"}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        )}
                    </div>
                );
            case 'badge':
                const badgeText = block.content?.text || block.content?.type || '';
                return (
                    <div key={block.id} className="py-2 flex justify-center">
                        <Badge variant="outline" className="px-3 py-1">
                            {badgeText}
                        </Badge>
                    </div>
                );
            case 'link':
                const linkLabel = block.content?.label || 'Link';
                const linkUrl = block.content?.url || '#';
                return (
                    <div key={block.id} className="py-2">
                        <Card>
                            <CardContent className="p-4">
                                <a
                                    href={linkUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-between hover:underline"
                                >
                                    <span>{linkLabel}</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-external-link">
                                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                        <polyline points="15 3 21 3 21 9"></polyline>
                                        <line x1="10" y1="14" x2="21" y2="3"></line>
                                    </svg>
                                </a>
                            </CardContent>
                        </Card>
                    </div>
                );
            default:
                // Use string type assertion for the unknown block type
                const unknownBlock = block as { type: string, id: string };
                return (
                    <div key={unknownBlock.id} className="p-4 text-center text-muted-foreground border-2 border-dashed border-muted rounded-lg">
                        <p>Unknown block type: {unknownBlock.type}</p>
                    </div>
                );
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">Loading profile...</div>;
    }
    console.log('Fetched profile:', profile);

    return (
        <>
            <main className="min-h-screen bg-background">
                <div className="container max-w-4xl mx-auto px-4 py-8">
                    {/* Profile Header */}
                    <div className="flex flex-col items-center mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                        {profile.image_url && (
                            <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
                                <Image
                                    src={profile.image_url}
                                    alt={profile.full_name || profile.username}
                                    width={96}
                                    height={96}
                                    className="object-cover w-full h-full"
                                />
                            </div>
                        )}

                        <h1 className="text-3xl font-bold text-center mb-2">
                            {profile.fullName || profile.username}
                        </h1>

                        {profile.tagline && (
                            <p className="text-muted-foreground text-center mb-2">{profile.tagline}</p>
                        )}

                        {profile.badge && (
                            <Badge variant="outline" className="mb-4">
                                {profile.badge}
                            </Badge>
                        )}

                        {/* Action buttons */}
                        <div className="flex gap-2 mt-2">
                            <Button variant="outline" size="sm" onClick={handleShare}>
                                <Share2 className="h-4 w-4 mr-2" />
                                Share
                            </Button>
                            {isOwner && (
                                <Button variant="outline" size="sm" onClick={handleEdit}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Bio Section */}
                    {profile.bio && (
                        <div className="mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                            <div className="prose max-w-none dark:prose-invert bio-content"
                                dangerouslySetInnerHTML={{ __html: profile.bio }} />
                        </div>
                    )}

                    {/* Blocks Section */}
                    {blocks.length > 0 && (
                        <div className="space-y-4 mb-8 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                            {blocks.map((block) => renderBlock(block))}
                        </div>
                    )}

                    {/* Links Section */}
                    {links.length > 0 && (
                        <div className="space-y-6 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                            {/* Social Links */}
                            {socialLinks.length > 0 && (
                                <div className="mb-6">
                                    <h2 className="text-xl font-semibold mb-4">Social</h2>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                        {socialLinks.map((link) => (
                                            <a
                                                key={link.id}
                                                href={link.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center p-3 rounded-lg border hover:bg-accent transition-colors"
                                            >
                                                {link.platform && (
                                                    <span className="mr-2 text-lg">
                                                        {/* Platform icon would go here */}
                                                        @
                                                    </span>
                                                )}
                                                <span className="truncate">{link.title}</span>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Blog Links */}
                            {blogLinks.length > 0 && (
                                <div className="mb-6">
                                    <h2 className="text-xl font-semibold mb-4">Blog</h2>
                                    <div className="space-y-3">
                                        {blogLinks.map((link) => (
                                            <a
                                                key={link.id}
                                                href={link.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="block p-4 rounded-lg border hover:bg-accent transition-colors"
                                            >
                                                <h3 className="font-medium">{link.title}</h3>
                                                {link.description && (
                                                    <p className="text-sm text-muted-foreground mt-1">{link.description}</p>
                                                )}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Normal Links */}
                            {normalLinks.length > 0 && (
                                <div className="mb-6">
                                    <h2 className="text-xl font-semibold mb-4">Links</h2>
                                    <div className="space-y-3">
                                        {normalLinks.map((link) => (
                                            <a
                                                key={link.id}
                                                href={link.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent transition-colors"
                                            >
                                                <span>{link.title}</span>
                                                <span className="text-muted-foreground">→</span>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Footer */}
                    <div className="text-center text-sm text-muted-foreground mt-12 pt-4 border-t animate-fade-in" style={{ animationDelay: '0.5s' }}>
                        <p>Made with Next-Lnks</p>
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
                
                .bio-content {
                    line-height: 1.6;
                }
                
                .bio-content p {
                    margin-bottom: 1rem;
                }
                
                .bio-content ul, .bio-content ol {
                    margin-left: 1.5rem;
                    margin-bottom: 1rem;
                }
                
                .bio-content a {
                    color: var(--color-primary);
                    text-decoration: underline;
                }
            `}</style>
        </>
    );
};

export default ProfileContent;

// components/blocks/editors/LinkBlockEditor.tsx - Fixed version
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LinkBlockType } from '@/shared/blocks';
import {
    Link2,
    ExternalLink,
    Globe,
    Github,
    Twitter,
    Instagram,
    Linkedin,
    Youtube,
    Settings,
    Eye,
    AlertCircle
} from 'lucide-react';

interface LinkBlockEditorProps {
    block: LinkBlockType;
    onChange: (block: LinkBlockType) => void;
    onClose?: () => void;
}

const platformConfig = {
    twitter: {
        icon: Twitter,
        label: 'Twitter',
        color: 'bg-blue-500',
        placeholder: 'https://twitter.com/username'
    },
    instagram: {
        icon: Instagram,
        label: 'Instagram',
        color: 'bg-pink-500',
        placeholder: 'https://instagram.com/username'
    },
    linkedin: {
        icon: Linkedin,
        label: 'LinkedIn',
        color: 'bg-blue-600',
        placeholder: 'https://linkedin.com/in/username'
    },
    github: {
        icon: Github,
        label: 'GitHub',
        color: 'bg-gray-700',
        placeholder: 'https://github.com/username'
    },
    youtube: {
        icon: Youtube,
        label: 'YouTube',
        color: 'bg-red-500',
        placeholder: 'https://youtube.com/@username'
    },
    dribbble: {
        icon: Globe,
        label: 'Dribbble',
        color: 'bg-pink-400',
        placeholder: 'https://dribbble.com/username'
    },
    behance: {
        icon: Globe,
        label: 'Behance',
        color: 'bg-blue-400',
        placeholder: 'https://behance.net/username'
    },
    medium: {
        icon: Globe,
        label: 'Medium',
        color: 'bg-gray-600',
        placeholder: 'https://medium.com/@username'
    },
    other: {
        icon: Globe,
        label: 'Other',
        color: 'bg-gray-500',
        placeholder: 'https://your-social-platform.com'
    }
};

export const LinkBlockEditor: React.FC<LinkBlockEditorProps> = ({
    block,
    onChange,
    onClose
}) => {
    const [localProps, setLocalProps] = useState(block.props);
    const [errors, setErrors] = useState<string[]>([]);
    const [isTestingLink, setIsTestingLink] = useState(false);

    // Validate on change
    useEffect(() => {
        const newErrors: string[] = [];

        if (!localProps.label?.trim()) {
            newErrors.push('Link label is required');
        }

        if (localProps.label && localProps.label.length > 100) {
            newErrors.push('Label must be less than 100 characters');
        }

        if (!localProps.url?.trim()) {
            newErrors.push('URL is required');
        } else {
            try {
                new URL(localProps.url);
            } catch {
                newErrors.push('Please enter a valid URL');
            }
        }

        setErrors(newErrors);
    }, [localProps.label, localProps.url]);

    const handleChange = (key: keyof LinkBlockType['props'], value: any) => {
        const newProps = { ...localProps, [key]: value };
        setLocalProps(newProps);

        onChange({
            ...block,
            props: newProps
        });
    };

    const testLink = async () => {
        if (!localProps.url) return;

        setIsTestingLink(true);
        try {
            window.open(localProps.url, '_blank', 'noopener,noreferrer');
        } catch (error) {
            console.error('Failed to open link:', error);
        } finally {
            setIsTestingLink(false);
        }
    };

    const generateLabelFromUrl = () => {
        if (!localProps.url) return;

        try {
            const url = new URL(localProps.url);
            let label = '';

            if (localProps.linkType === 'social' && localProps.platform) {
                const platformInfo = platformConfig[localProps.platform];
                label = `My ${platformInfo.label}`;
            } else {
                label = url.hostname.replace('www.', '');
            }

            handleChange('label', label);
        } catch {
            // Invalid URL, don't auto-generate
        }
    };

    const currentPlatform = localProps.platform ? platformConfig[localProps.platform] : null;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Link2 className="w-5 h-5" />
                    <h3 className="text-lg font-semibold">Edit Link Block</h3>
                </div>
                {onClose && (
                    <Button variant="outline" size="sm" onClick={onClose}>
                        Done
                    </Button>
                )}
            </div>

            {/* Basic Settings */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Settings className="w-4 h-4" />
                        Basic Information
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="link-label">Link Label</Label>
                        <div className="flex gap-2">
                            <Input
                                id="link-label"
                                value={localProps.label}
                                onChange={(e) => handleChange('label', e.target.value)}
                                placeholder="Enter link title"
                                className={errors.some(e => e.includes('label')) ? 'border-red-500' : ''}
                            />
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={generateLabelFromUrl}
                                disabled={!localProps.url}
                            >
                                Auto
                            </Button>
                        </div>
                        <div className="text-xs text-muted-foreground">
                            {localProps.label.length}/100 characters
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="link-url">URL</Label>
                        <div className="flex gap-2">
                            <Input
                                id="link-url"
                                value={localProps.url}
                                onChange={(e) => handleChange('url', e.target.value)}
                                placeholder={currentPlatform?.placeholder || "https://example.com"}
                                className={errors.some(e => e.includes('URL')) ? 'border-red-500' : ''}
                            />
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={testLink}
                                disabled={!localProps.url || isTestingLink}
                            >
                                <Eye className="w-4 h-4" />
                            </Button>
                        </div>
                        {errors.length > 0 && (
                            <div className="flex items-center gap-2 text-sm text-red-500">
                                <AlertCircle className="w-4 h-4" />
                                {errors[0]}
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Link Type Settings */}
            <Card>
                <CardHeader>
                    <CardTitle>Link Type</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Type</Label>
                        <Select
                            value={localProps.linkType || 'normal'}
                            onValueChange={(value) => {
                                handleChange('linkType', value);
                                // Clear platform when changing type
                                if (value !== 'social') {
                                    handleChange('platform', undefined);
                                }
                            }}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="normal">
                                    <div className="flex items-center gap-2">
                                        <Globe className="w-4 h-4" />
                                        <div>
                                            <div>Normal Link</div>
                                            <div className="text-xs text-muted-foreground">Regular website or page</div>
                                        </div>
                                    </div>
                                </SelectItem>
                                <SelectItem value="social">
                                    <div className="flex items-center gap-2">
                                        <Twitter className="w-4 h-4" />
                                        <div>
                                            <div>Social Media</div>
                                            <div className="text-xs text-muted-foreground">Social platform profile</div>
                                        </div>
                                    </div>
                                </SelectItem>
                                <SelectItem value="blog">
                                    <div className="flex items-center gap-2">
                                        <Globe className="w-4 h-4" />
                                        <div>
                                            <div>Blog Post</div>
                                            <div className="text-xs text-muted-foreground">Article or blog post</div>
                                        </div>
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {localProps.linkType === 'social' && (
                        <div className="space-y-2">
                            <Label>Platform</Label>
                            <Select
                                value={localProps.platform || ''}
                                onValueChange={(value) => handleChange('platform', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select social platform" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.entries(platformConfig).map(([key, { label, icon: Icon, color }]) => (
                                        <SelectItem key={key} value={key}>
                                            <div className="flex items-center gap-2">
                                                <div className={`w-3 h-3 rounded-full ${color}`} />
                                                <Icon className="w-4 h-4" />
                                                {label}
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    {localProps.linkType === 'blog' && (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="cover-image">Cover Image URL (optional)</Label>
                                <Input
                                    id="cover-image"
                                    value={localProps.cover || ''}
                                    onChange={(e) => handleChange('cover', e.target.value)}
                                    placeholder="https://example.com/cover.jpg"
                                />
                                {localProps.cover && (
                                    <div className="mt-2">
                                        <img
                                            src={localProps.cover}
                                            alt="Cover preview"
                                            className="w-full h-32 object-cover rounded-md border"
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Preview */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        Preview
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="border rounded-lg overflow-hidden">
                        <div className="p-4 hover:bg-muted/50 transition-colors">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    {currentPlatform ? (
                                        <currentPlatform.icon className="w-5 h-5 text-muted-foreground" />
                                    ) : (
                                        <Globe className="w-5 h-5 text-muted-foreground" />
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium truncate">
                                            {localProps.label || 'Link title'}
                                        </div>
                                        {localProps.linkType === 'social' && localProps.platform && (
                                            <div className="text-sm text-muted-foreground capitalize">
                                                {platformConfig[localProps.platform]?.label}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <ExternalLink className="w-4 h-4 text-muted-foreground" />
                            </div>

                            {localProps.linkType === 'blog' && localProps.cover && (
                                <div className="mt-3">
                                    <img
                                        src={localProps.cover}
                                        alt={localProps.label}
                                        className="w-full h-32 object-cover rounded-md"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                handleChange('linkType', 'normal');
                                handleChange('platform', undefined);
                                handleChange('cover', undefined);
                            }}
                        >
                            Make Normal Link
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                handleChange('linkType', 'social');
                                if (!localProps.platform) handleChange('platform', 'twitter');
                            }}
                        >
                            Make Social Link
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                handleChange('linkType', 'blog');
                                handleChange('platform', undefined);
                            }}
                        >
                            Make Blog Link
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default LinkBlockEditor;
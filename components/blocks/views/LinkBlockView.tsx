import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LinkBlockType } from '@/shared/blocks';
import { ExternalLink, Globe, Github, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';

interface LinkBlockViewProps {
    block: LinkBlockType;
    isEditing: boolean;
    onChange: (block: LinkBlockType) => void;
}

const platformConfig = {
    twitter: {
        icon: Twitter,
        label: 'Twitter',
        color: 'hover:bg-blue-50 hover:border-blue-200',
        iconColor: 'text-blue-500'
    },
    instagram: {
        icon: Instagram,
        label: 'Instagram',
        color: 'hover:bg-pink-50 hover:border-pink-200',
        iconColor: 'text-pink-500'
    },
    linkedin: {
        icon: Linkedin,
        label: 'LinkedIn',
        color: 'hover:bg-blue-50 hover:border-blue-200',
        iconColor: 'text-blue-600'
    },
    github: {
        icon: Github,
        label: 'GitHub',
        color: 'hover:bg-gray-50 hover:border-gray-200',
        iconColor: 'text-gray-700'
    },
    youtube: {
        icon: Youtube,
        label: 'YouTube',
        color: 'hover:bg-red-50 hover:border-red-200',
        iconColor: 'text-red-500'
    },
    dribbble: {
        icon: Globe,
        label: 'Dribbble',
        color: 'hover:bg-pink-50 hover:border-pink-200',
        iconColor: 'text-pink-400'
    },
    behance: {
        icon: Globe,
        label: 'Behance',
        color: 'hover:bg-blue-50 hover:border-blue-200',
        iconColor: 'text-blue-400'
    },
    medium: {
        icon: Globe,
        label: 'Medium',
        color: 'hover:bg-gray-50 hover:border-gray-200',
        iconColor: 'text-gray-600'
    },
    other: {
        icon: Globe,
        label: 'Other',
        color: 'hover:bg-gray-50 hover:border-gray-200',
        iconColor: 'text-gray-500'
    }
};

const linkTypeConfig = {
    normal: {
        label: 'Normal Link',
        icon: Globe,
        description: 'Regular website or page link'
    },
    social: {
        label: 'Social Media',
        icon: Twitter,
        description: 'Social media platform link'
    },
    blog: {
        label: 'Blog Post',
        icon: Globe,
        description: 'Blog article or post link'
    }
};

export const LinkBlockView: React.FC<LinkBlockViewProps> = ({
    block,
    isEditing,
    onChange
}) => {
    const linkType = block.props.linkType || 'normal';
    const platform = block.props.platform;
    const platformInfo = platform ? platformConfig[platform] || platformConfig.other : null;

    const getIcon = () => {
        if (linkType === 'social' && platformInfo) {
            const IconComponent = platformInfo.icon;
            return <IconComponent className={`w-5 h-5 ${platformInfo.iconColor}`} />;
        }

        const typeInfo = linkTypeConfig[linkType];
        const IconComponent = typeInfo.icon;
        return <IconComponent className="w-5 h-5 text-muted-foreground" />;
    };

    const getHoverColor = () => {
        if (linkType === 'social' && platformInfo) {
            return platformInfo.color;
        }
        return 'hover:bg-gray-50 hover:border-gray-200';
    };

    if (isEditing) {
        return (
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor={`link-label-${block.id}`}>Label</Label>
                        <Input
                            id={`link-label-${block.id}`}
                            value={block.props.label}
                            onChange={(e) => onChange({
                                ...block,
                                props: { ...block.props, label: e.target.value }
                            })}
                            placeholder="Link title"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor={`link-url-${block.id}`}>URL</Label>
                        <Input
                            id={`link-url-${block.id}`}
                            value={block.props.url}
                            onChange={(e) => onChange({
                                ...block,
                                props: { ...block.props, url: e.target.value }
                            })}
                            placeholder="https://..."
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor={`link-type-${block.id}`}>Link Type</Label>
                        <Select
                            value={linkType}
                            onValueChange={(value) => onChange({
                                ...block,
                                props: {
                                    ...block.props,
                                    linkType: value as LinkBlockType['props']['linkType'],
                                    // Clear platform when changing type
                                    platform: value === 'social' ? block.props.platform : undefined
                                }
                            })}
                        >
                            <SelectTrigger id={`link-type-${block.id}`}>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.entries(linkTypeConfig).map(([key, { label, description }]) => (
                                    <SelectItem key={key} value={key}>
                                        <div>
                                            <div className="font-medium">{label}</div>
                                            <div className="text-xs text-muted-foreground">{description}</div>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {linkType === 'social' && (
                        <div className="space-y-2">
                            <Label htmlFor={`platform-${block.id}`}>Platform</Label>
                            <Select
                                value={platform || ''}
                                onValueChange={(value) => onChange({
                                    ...block,
                                    props: { ...block.props, platform: value }
                                })}
                            >
                                <SelectTrigger id={`platform-${block.id}`}>
                                    <SelectValue placeholder="Select platform" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.entries(platformConfig).map(([key, { label, icon: Icon, iconColor }]) => (
                                        <SelectItem key={key} value={key}>
                                            <div className="flex items-center gap-2">
                                                <Icon className={`w-4 h-4 ${iconColor}`} />
                                                {label}
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                </div>

                {linkType === 'blog' && (
                    <div className="space-y-2">
                        <Label htmlFor={`cover-image-${block.id}`}>Cover Image URL (optional)</Label>
                        <Input
                            id={`cover-image-${block.id}`}
                            value={block.props.cover || ''}
                            onChange={(e) => onChange({
                                ...block,
                                props: { ...block.props, cover: e.target.value }
                            })}
                            placeholder="https://example.com/cover.jpg"
                        />
                    </div>
                )}

                {/* Preview */}
                <div className="space-y-2">
                    <Label>Preview</Label>
                    <Card>
                        <CardContent className="p-0">
                            <div className={`p-4 transition-all ${getHoverColor()} border rounded-lg`}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        {getIcon()}
                                        <div className="flex-1">
                                            <div className="font-medium">
                                                {block.props.label || 'Link title'}
                                            </div>
                                            {linkType === 'social' && platform && (
                                                <div className="text-sm text-muted-foreground capitalize">
                                                    {platformConfig[platform]?.label || platform}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                                </div>

                                {linkType === 'blog' && block.props.cover && (
                                    <div className="mt-3">
                                        <img
                                            src={block.props.cover}
                                            alt={block.props.label}
                                            className="w-full h-32 object-cover rounded-md"
                                        />
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    // Display mode
    if (!block.props.url || !block.props.label) {
        return (
            <Card className="opacity-50">
                <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Globe className="w-5 h-5 text-muted-foreground" />
                            <div className="font-medium text-muted-foreground">
                                Add your link
                            </div>
                        </div>
                        <ExternalLink className="w-4 h-4 text-muted-foreground" />
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <a
            href={block.props.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full group"
        >
            <Card className={`transition-all cursor-pointer ${getHoverColor()} group-hover:shadow-md group-hover:-translate-y-0.5`}>
                <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                            {getIcon()}
                            <div className="flex-1 min-w-0">
                                <div className="font-medium truncate">{block.props.label}</div>
                                {linkType === 'social' && platform && (
                                    <div className="text-sm text-muted-foreground capitalize">
                                        {platformConfig[platform]?.label || platform}
                                    </div>
                                )}
                            </div>
                        </div>
                        <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </div>

                    {linkType === 'blog' && block.props.cover && (
                        <div className="mt-3">
                            <img
                                src={block.props.cover}
                                alt={block.props.label}
                                className="w-full h-32 object-cover rounded-md"
                            />
                        </div>
                    )}
                </CardContent>
            </Card>
        </a>
    );
};

export default LinkBlockView;
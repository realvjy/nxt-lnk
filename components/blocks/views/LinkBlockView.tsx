import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LinkBlockType } from '@/types/app/blocks';
import { ExternalLink, Globe, Github, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';
import { SocialPlatform } from '@/types/index';

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
    const linkType = block.content.linkType || 'normal';
    const platform = block.content.platform;
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

            </div>
        );
    }

    // Display mode
    if (!block.content.url || !block.content.label) {
        return (
            <Card className="opacity-50">
                Link Block View
            </Card>
        );
    }

    return (
        <a
            href={block.content.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full group"
        >
            Link Block View
        </a>
    );
};

export default LinkBlockView;
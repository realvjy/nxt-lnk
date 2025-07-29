import React, { useState } from 'react';
// Import from the central types index
import {
    Globe,
    Github,
    Twitter,
    Instagram,
    Linkedin,
    Youtube
} from 'lucide-react';
import { LinkBlockType } from '@/types/app/blocks';
import { SocialPlatform } from '@/types/index';

interface LinkBlockEditorProps {
    block: LinkBlockType;
    onChange: (block: LinkBlockType) => void;
    onClose?: () => void;
}

type PlatformConfig = {
    [key in SocialPlatform]: {
        icon: React.ElementType;
        label: string;
        color: string;
        placeholder: string;
    }
};

const platformConfig: PlatformConfig = {
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
    facebook: {
        icon: Globe,
        label: 'Facebook',
        color: 'bg-blue-700',
        placeholder: 'https://facebook.com/username'
    },
    tiktok: {
        icon: Globe,
        label: 'TikTok',
        color: 'bg-black',
        placeholder: 'https://tiktok.com/@username'
    },
    twitch: {
        icon: Globe,
        label: 'Twitch',
        color: 'bg-purple-600',
        placeholder: 'https://twitch.tv/username'
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
    const [localProps, setLocalProps] = useState(block.content);

    return (
        <div className="space-y-6">
            {/* Header */}
            Link Block Editor
        </div>
    );
};

export default LinkBlockEditor;
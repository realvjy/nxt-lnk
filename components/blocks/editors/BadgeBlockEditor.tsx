import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { BadgeBlockType } from '@/shared/app/blocks';
import { Shield, Eye, Palette } from 'lucide-react';

interface BadgeBlockEditorProps {
    block: BadgeBlockType;
    onChange: (block: BadgeBlockType) => void;
    onClose?: () => void;
}

const badgeConfig = {
    available: {
        variant: 'default' as const,
        label: 'Available',
        color: 'bg-green-500',
        description: 'Ready to connect and collaborate'
    },
    busy: {
        variant: 'secondary' as const,
        label: 'Busy',
        color: 'bg-yellow-500',
        description: 'Currently occupied with work'
    },
    away: {
        variant: 'outline' as const,
        label: 'Away',
        color: 'bg-gray-500',
        description: 'Temporarily unavailable'
    },
    offline: {
        variant: 'destructive' as const,
        label: 'Offline',
        color: 'bg-red-500',
        description: 'Not available at the moment'
    },
    live: {
        variant: 'destructive' as const,
        label: 'Live',
        color: 'bg-red-500',
        description: 'Currently streaming or presenting'
    },
    exclusive: {
        variant: 'default' as const,
        label: 'Exclusive',
        color: 'bg-purple-500',
        description: 'Special or premium status'
    }
};

export const BadgeBlockEditor: React.FC<BadgeBlockEditorProps> = ({
    block,
    onChange,
    onClose
}) => {
    const [localProps, setLocalProps] = useState(block.content);


    return (
        <div className="space-y-6">
            {/* Header */}
            Badge Editor
        </div>
    );
};

export default BadgeBlockEditor;
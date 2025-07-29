import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { BadgeBlockType } from '@/types/app/blocks';

interface BadgeBlockViewProps {
    block: BadgeBlockType;
    isEditing: boolean;
    onChange: (block: BadgeBlockType) => void;
}

const badgeVariants = {
    available: {
        variant: 'default' as const,
        label: 'Available',
        color: 'bg-green-500',
        description: 'Ready to connect'
    },
    busy: {
        variant: 'secondary' as const,
        label: 'Busy',
        color: 'bg-yellow-500',
        description: 'Currently occupied'
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
        description: 'Not available'
    },
    live: {
        variant: 'destructive' as const,
        label: 'Live',
        color: 'bg-red-500',
        description: 'Currently streaming/presenting'
    },
    exclusive: {
        variant: 'default' as const,
        label: 'Exclusive',
        color: 'bg-purple-500',
        description: 'Special status'
    }
};

export const BadgeBlockView: React.FC<BadgeBlockViewProps> = ({
    block,
    isEditing,
    onChange
}) => {
    const currentBadge = badgeVariants[block.content.type];

    if (isEditing) {
        return (
            <div className="space-y-4">
                Slash Menu Link
            </div>
        );
    }

    // Display mode
    return (
        <div className="text-center">
            Slash Menu Link
        </div>
    );
};

export default BadgeBlockView;
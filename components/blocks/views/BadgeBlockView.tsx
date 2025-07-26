import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { BadgeBlockType } from '@/shared/app/blocks';

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
                <div className="space-y-2">
                    <Label htmlFor={`badge-type-${block.id}`}>Badge Type</Label>
                    <Select
                        value={block.content.type}
                        onValueChange={(value) => onChange({
                            ...block,
                            content: { ...block.content, type: value as BadgeBlockType['content']['type'] }
                        })}
                    >
                        <SelectTrigger id={`badge-type-${block.id}`}>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {Object.entries(badgeVariants).map(([key, { label, description }]) => (
                                <SelectItem key={key} value={key}>
                                    <div className="flex items-center gap-2">
                                        <div className={`w-3 h-3 rounded-full ${badgeVariants[key].color}`} />
                                        <div>
                                            <div className="font-medium">{label}</div>
                                            <div className="text-xs text-muted-foreground">{description}</div>
                                        </div>
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor={`badge-text-${block.id}`}>Custom Text (optional)</Label>
                    <Input
                        id={`badge-text-${block.id}`}
                        value={block.content.text || ''}
                        onChange={(e) => onChange({
                            ...block,
                            content: { ...block.content, text: e.target.value }
                        })}
                        placeholder={`Default: ${currentBadge?.label}`}
                    />
                </div>

                <div className="space-y-2">
                    <Label>Preview</Label>
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex justify-center">
                                <Badge
                                    variant={currentBadge?.variant}
                                    className={`${block.content.type === 'live' ? 'animate-pulse' : ''}`}
                                >
                                    <div className={`w-2 h-2 rounded-full mr-2 ${currentBadge?.color}`} />
                                    {block.content.text || currentBadge?.label}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    // Display mode
    return (
        <div className="text-center">
            <Badge
                variant={currentBadge?.variant}
                className={`text-sm px-3 py-1 ${block.content.type === 'live' ? 'animate-pulse' : ''
                    }`}
            >
                <div className={`w-2 h-2 rounded-full mr-2 ${currentBadge?.color}`} />
                {block.content.text || currentBadge?.label}
            </Badge>
        </div>
    );
};

export default BadgeBlockView;
// components/blocks/editors/BadgeBlockEditor.tsx - Fixed version
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { BadgeBlockType } from '@/shared/blocks';
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
    const [localProps, setLocalProps] = useState(block.props);

    const handleChange = (key: keyof BadgeBlockType['props'], value: any) => {
        const newProps = { ...localProps, [key]: value };
        setLocalProps(newProps);

        onChange({
            ...block,
            props: newProps
        });
    };

    const currentBadge = badgeConfig[localProps.type];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    <h3 className="text-lg font-semibold">Edit Badge Block</h3>
                </div>
                {onClose && (
                    <Button variant="outline" size="sm" onClick={onClose}>
                        Done
                    </Button>
                )}
            </div>

            {/* Badge Settings */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Palette className="w-4 h-4" />
                        Badge Settings
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Badge Type</Label>
                        <Select
                            value={localProps.type}
                            onValueChange={(value) => handleChange('type', value)}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.entries(badgeConfig).map(([key, { label, description, color }]) => (
                                    <SelectItem key={key} value={key}>
                                        <div className="flex items-center gap-3">
                                            <div className={`w-3 h-3 rounded-full ${color}`} />
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
                        <Label>Custom Text (optional)</Label>
                        <Input
                            value={localProps.text || ''}
                            onChange={(e) => handleChange('text', e.target.value)}
                            placeholder={`Default: ${currentBadge?.label}`}
                        />
                        <div className="text-xs text-muted-foreground">
                            Leave empty to use the default badge text
                        </div>
                    </div>
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
                    <div className="flex justify-center p-8 bg-muted/20 rounded-lg">
                        <Badge
                            variant={currentBadge?.variant}
                            className={`text-sm px-3 py-1 ${localProps.type === 'live' ? 'animate-pulse' : ''
                                }`}
                        >
                            <div className={`w-2 h-2 rounded-full mr-2 ${currentBadge?.color}`} />
                            {localProps.text || currentBadge?.label}
                        </Badge>
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
                        {Object.entries(badgeConfig).map(([key, { label }]) => (
                            <Button
                                key={key}
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    handleChange('type', key);
                                    handleChange('text', '');
                                }}
                            >
                                Set as {label}
                            </Button>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default BadgeBlockEditor;
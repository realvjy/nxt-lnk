'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLinkOperations } from '@/lib/stores';
import {
    ExternalLink,
    Trash2,
    Eye,
    EyeOff,
    Link2,
    Globe,
    Rss
} from 'lucide-react';

const LinksList: React.FC = () => {
    const { links, hasLinks, deleteLink, updateLink } = useLinkOperations();

    const toggleLinkActive = (linkId: string, currentActive: boolean) => {
        updateLink(linkId, { isActive: !currentActive });
    };

    const getLinkIcon = (type: string) => {
        switch (type) {
            case 'social': return <Globe className="w-4 h-4" />;
            case 'blog': return <Rss className="w-4 h-4" />;
            default: return <Link2 className="w-4 h-4" />;
        }
    };

    const getLinkTypeColor = (type: string) => {
        switch (type) {
            case 'social': return 'bg-blue-100 text-blue-800';
            case 'blog': return 'bg-purple-100 text-purple-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (!hasLinks) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Link2 className="w-5 h-5" />
                        Saved Links
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                        <Link2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-medium mb-2">No saved links yet</p>
                        <p className="text-sm">
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Link2 className="w-5 h-5" />
                    Saved Links ({links.length})
                </CardTitle>
            </CardHeader>
            {/* <CardContent>
                <div className="space-y-3">
                    {links.map((link) => (
                        <div
                            key={link.id}
                            className={`p-4 border rounded-lg transition-all ${link.isActive
                                ? 'bg-white border-gray-200'
                                : 'bg-gray-50 border-gray-100 opacity-60'
                                }`}
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-2">
                                        {getLinkIcon(link.type)}
                                        <h3 className="font-medium truncate">{link.title}</h3>
                                        <Badge
                                            variant="secondary"
                                            className={`text-xs ${getLinkTypeColor(link.type)}`}
                                        >
                                            {link.type}
                                        </Badge>
                                        {!link.isActive && (
                                            <Badge variant="outline" className="text-xs">
                                                Hidden
                                            </Badge>
                                        )}
                                    </div>
                                    <p className="text-sm text-muted-foreground truncate">
                                        {link.url}
                                    </p>
                                </div>

                                <div className="flex items-center gap-1">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => window.open(link.url, '_blank')}
                                        className="h-8 w-8 p-0"
                                        title="Open link"
                                    >
                                        <ExternalLink className="w-3 h-3" />
                                    </Button>

                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => toggleLinkActive(link.id, link.isActive)}
                                        className="h-8 w-8 p-0"
                                        title={link.isActive ? "Hide link" : "Show link"}
                                    >
                                        {link.isActive ? (
                                            <Eye className="w-3 h-3" />
                                        ) : (
                                            <EyeOff className="w-3 h-3" />
                                        )}
                                    </Button>

                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => deleteLink(link.id)}
                                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                        title="Delete link"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent> */}
        </Card>
    );
};

export default LinksList;

import { useEffect } from 'react';
import { useSupabase } from '@/components/providers/SupabaseProvider';
import { useLinksStore } from '@/lib/stores';
import { mapLinkFromDb, mapLinkToDb } from '@/shared/supabase/mappings';
import { Link, isSocialLink, isBlogLink, isNormalLink } from '@/shared/app/links';

export const useLinks = (userId: string) => {
    const { supabase } = useSupabase();
    const { links, setLinks, clearLinks } = useLinksStore();
    const isLoading = useLinksStore((state) => state.isLoading);
    const error = useLinksStore((state) => state.error);
    const setLoading = useLinksStore((state) => state.setLoading);
    const setError = useLinksStore((state) => state.setError);
    useEffect(() => {
        if (!userId) {
            clearLinks();
            setLoading(false);
            return;
        }
        const fetchLinks = async () => {
            const { data: linksData, error } = await supabase
                .from('links')
                .select('*')
                .eq('profile_id', userId)
                .order('sort_order', { ascending: true });

            if (error) {
                console.error('Error fetching links:', error);
            } else if (linksData) {
                const formattedLinks = linksData.map(link => {
                    if (isSocialLink(link)) {
                        return link as Link;
                    } else if (isBlogLink(link)) {
                        return link as Link;
                    } else if (isNormalLink(link)) {
                        return link as Link;
                    } else {
                        console.warn('Unknown link type:', link);
                        return null;
                    }
                }).filter((link): link is Link => link !== null);

                setLinks(formattedLinks);
            } else {
                clearLinks();
            }
        };

        fetchLinks();
    }, [userId, setLinks, setLoading, setError, clearLinks]);

    return { links, loading: isLoading, error };
};
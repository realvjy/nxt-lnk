import { useEffect, useState } from 'react';
import { preferenceService } from '@/supabase/services';

export function usePreferences(profileId?: string) {
    const [preferences, setPreferences] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!profileId) {
            setPreferences(null);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        preferenceService.getPreferences(profileId)
            .then((data) => {
                setPreferences(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message || 'Failed to fetch preferences');
                setLoading(false);
            });
    }, [profileId]);

    return { preferences, loading, error };
}
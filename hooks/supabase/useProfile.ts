import { useEffect, useState } from 'react';
import { profileService } from '@/supabase/services';
import { useUserStore } from '@/lib/stores';

/**
 * useProfile - React hook to access and fetch the user's profile from the store.
 * @param username - The username to fetch the profile for.
 * @returns { profile, loading, error }
 */


export function useProfile({ id, username }: { id?: string; username?: string }) {
    const profile = useUserStore((state) => state.profile);
    const loading = useUserStore((state) => state.loading);
    const error = useUserStore((state) => state.error);
    const fetchProfile = useUserStore((state) => state.fetchProfile);
    const setLoading = useUserStore((state) => state.setLoading);

    useEffect(() => {
        if (!id && !username) {
            setLoading(false);
            return;
        }
        // Prefer ID if available, else use username
        fetchProfile(id || username);
    }, [id, username, fetchProfile, setLoading]);

    return { profile, loading, error };
}
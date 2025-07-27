import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabase } from '@/components/providers/SupabaseProvider';

export const useAuth = () => {
    const { supabase } = useSupabase();
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            try {
                const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
                if (sessionError || !sessionData.session) {
                    router.push('/login');
                    return;
                }

                const { data: { user }, error } = await supabase.auth.getUser();
                if (error || !user) {
                    router.push('/login');
                    return;
                }

                setUser(user);
            } catch (error) {
                console.error('Error in checkUser:', error);
                router.push('/login');
            } finally {
                setIsLoading(false);
            }
        };

        checkUser();
    }, [supabase, router]);

    return { user, isLoading };
};
'use client'

import { createContext, useContext, useEffect, ReactNode, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/supbase/types'

interface SupabaseContextType {
    supabase: ReturnType<typeof createClientComponentClient<Database>>
    logout: () => Promise<void>
    user: any;
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined)

interface SupabaseProviderProps {
    children: ReactNode
}

export function SupabaseProvider({ children }: SupabaseProviderProps) {
    const supabase = createClientComponentClient<Database>();
    const router = useRouter();
    const [user, setUser] = useState(null);

    // Define the logout function
    const logout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Error signing out:', error);
        } else {
            router.push('/login');
        }
    };

    useEffect(() => {
        const checkUser = async () => {
            const { data, error } = await supabase.auth.getSession();
            if (error) {
                console.error('Error checking session:', error);
            } else {
                setUser(data?.session?.user || null); // Ensure user is accessed correctly
            }
        };

        checkUser();

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_OUT') {
                router.push('/login');
            }
            if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
                setUser(session?.user || null); // Ensure user is accessed correctly
                router.refresh();
            }
        });

        return () => subscription.unsubscribe();
    }, [router, supabase]);

    return (
        <SupabaseContext.Provider value={{ supabase, logout, user }}>
            {children}
        </SupabaseContext.Provider>
    );
}

export const useSupabase = () => {
    const context = useContext(SupabaseContext)
    if (context === undefined) {
        throw new Error('useSupabase must be used within a SupabaseProvider')
    }
    return context
}
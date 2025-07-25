'use client'

import { createContext, useContext, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'  // Changed from next/router
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/lib/supabase/types'

interface SupabaseContextType {
    supabase: ReturnType<typeof createClientComponentClient<Database>>
    logout: () => Promise<void>
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined)

interface SupabaseProviderProps {
    children: ReactNode
}

export function SupabaseProvider({ children }: SupabaseProviderProps) {
    const supabase = createClientComponentClient<Database>()
    const router = useRouter()

    // Logout function
    const logout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Error signing out:', error);
        } else {
            router.push('/login');
        }
    };

    useEffect(() => {
        // Check initial auth state
        const checkUser = async () => {
            const { data, error } = await supabase.auth.getSession();
            if (error) {
                console.error('Error checking session:', error);
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
                router.refresh();
            }
        })

        return () => subscription.unsubscribe()
    }, [router, supabase])

    return (
        <SupabaseContext.Provider value={{ supabase, logout }}>
            {children}
        </SupabaseContext.Provider>
    )
}

export const useSupabase = () => {
    const context = useContext(SupabaseContext)
    if (context === undefined) {
        throw new Error('useSupabase must be used within a SupabaseProvider')
    }
    return context
}
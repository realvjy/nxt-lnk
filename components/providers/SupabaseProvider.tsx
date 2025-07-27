'use client'
import { supabase } from '@/supabase/client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const SupabaseContext = createContext(null);

export const SupabaseProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const router = useRouter(); // Ensure this is used in a client-side context

    useEffect(() => {
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user ?? null);
        };

        getSession();

        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    const logout = async () => {
        try {
            await supabase.auth.signOut();
            setUser(null);
            router.push('/login'); // Redirect to login page after logout
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    // Debugging: Log the user
    useEffect(() => {
        console.log('SupabaseProvider User:', user);
    }, [user]);

    return (
        <SupabaseContext.Provider value={{ supabase, user, logout }}>
            {children}
        </SupabaseContext.Provider>
    );
};

export const useSupabase = () => {
    const context = useContext(SupabaseContext);
    if (!context) {
        throw new Error('useSupabase must be used within a SupabaseProvider');
    }
    return context;
};
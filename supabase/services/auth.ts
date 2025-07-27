import { supabase } from '../client';
import { logError } from '../utils/logger';

export const authService = {
    signIn: async (provider: 'github' | 'google') => {
        try {
            return await supabase.auth.signInWithOAuth({ provider });
        } catch (error) {
            logError('Error signing in with OAuth:', error);
            throw error;
        }
    },
    signOut: async () => {
        try {
            return await supabase.auth.signOut();
        } catch (error) {
            logError('Error signing out:', error);
            throw error;
        }
    },
    getCurrentUser: async () => {
        try {
            return await supabase.auth.getUser();
        } catch (error) {
            logError('Error getting current user:', error);
            throw error;
        }
    }
};
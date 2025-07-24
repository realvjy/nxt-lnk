import { supabase } from '../client'

export const authService = {
    signIn: async (provider: 'github' | 'google') => {
        return await supabase.auth.signInWithOAuth({ provider })
    },
    signOut: async () => {
        return await supabase.auth.signOut()
    },
    getCurrentUser: async () => {
        return await supabase.auth.getUser()
    }
}
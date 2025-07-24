import { supabase } from './client'

export async function testSupabaseConnection() {
    try {
        // Try to get the current time from Supabase
        const { data, error } = await supabase.rpc('get_server_time')

        if (error) {
            console.error('Supabase connection error:', error.message)
            return {
                connected: false,
                error: error.message
            }
        }

        return {
            connected: true,
            serverTime: data
        }
    } catch (error) {
        console.error('Failed to connect to Supabase:', error)
        return {
            connected: false,
            error: 'Failed to connect to Supabase'
        }
    }
}
import { Database } from '@/shared/supabase/tables';
import { createClient } from '@supabase/supabase-js';

export const initSupabaseClient = () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    return createClient<Database>(supabaseUrl, supabaseKey);
};
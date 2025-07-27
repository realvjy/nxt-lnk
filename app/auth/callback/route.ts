import { cookies } from 'next/headers';
import { NextResponse, type NextRequest } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/supbase/types';

export const runtime = 'nodejs'; // ensure service role is available

export async function GET(request: NextRequest) {
    const url = new URL(request.url);
    const code = url.searchParams.get('code');

    if (!code) {
        return NextResponse.redirect(new URL('/login?error=no_code', url.origin));
    }

    try {
        // Create a Supabase client for the current request
        const cookieStore = cookies();
        const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore });

        // Exchange the code for a session
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        if (exchangeError) {
            console.error('exchangeCodeForSession:', exchangeError);
            return NextResponse.redirect(new URL('/login?error=auth_error', url.origin));
        }

        const {
            data: { user },
            error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
            console.error('getUser error:', userError);
            return NextResponse.redirect(new URL('/login?error=session_error', url.origin));
        }

        // Create admin client with service role for database operations
        const supabaseAdmin = createClient<Database>(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!,
            { auth: { persistSession: false } }
        );

        // Check if profile exists - use id as the primary identifier
        const { data: profile, error: profileError } = await supabaseAdmin
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .maybeSingle();

        if (profileError) {
            console.error('profile select error:', profileError);
            return NextResponse.redirect(new URL('/login?error=profile_select_error', url.origin));
        }

        // If no profile exists, create one
        if (!profile) {
            // Get username from metadata or email or generate a default
            const username = user.user_metadata?.username ||
                user.email?.split('@')[0] ||
                `user_${user.id.slice(0, 6)}`;

            // Insert new profile with consistent id/user_id fields
            const { error: createError } = await supabaseAdmin.from('profiles').insert({
                id: user.id,
                user_id: user.id, // Include both for compatibility
                username,
                email: user.email,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            });

            if (createError) {
                console.error('profile insert error:', createError);
                return NextResponse.redirect(new URL('/login?error=profile_error', url.origin));
            }
        }

        // Redirect to edit page after successful authentication
        return NextResponse.redirect(new URL('/edit', url.origin));
    } catch (e) {
        console.error('Unexpected error:', e);
        return NextResponse.redirect(new URL('/login?error=unknown', url.origin));
    }
}

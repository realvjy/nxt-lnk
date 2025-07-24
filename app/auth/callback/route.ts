import { cookies } from 'next/headers';
import { NextResponse, type NextRequest } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/supabase/types';

export const runtime = 'nodejs'; // ensure service role is available

export async function GET(request: NextRequest) {
    const url = new URL(request.url);
    const code = url.searchParams.get('code');

    if (!code) {
        return NextResponse.redirect(new URL('/login?error=no_code', url.origin));
    }

    try {
        const supabase = createRouteHandlerClient<Database>({ cookies });
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

        const supabaseAdmin = createClient<Database>(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!,
            { auth: { persistSession: false } }
        );

        // Check by id, not user_id
        const { data: profile, error: profileError } = await supabaseAdmin
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .maybeSingle();

        if (profileError) {
            console.error('profile select error:', profileError);
            return NextResponse.redirect(new URL('/login?error=profile_select_error', url.origin));
        }

        if (!profile) {
            const username = user.user_metadata?.username ?? user.email?.split('@')[0] ?? `user_${user.id.slice(0, 6)}`;

            const { error: createError } = await supabaseAdmin.from('profiles').insert({
                id: user.id,
                username,
                email: user.email,
            });

            if (createError) {
                console.error('profile insert error:', createError);
                return NextResponse.redirect(new URL('/login?error=profile_error', url.origin));
            }
        }

        return NextResponse.redirect(new URL('/edit', url.origin));
    } catch (e) {
        console.error('Unexpected error:', e);
        return NextResponse.redirect(new URL('/login?error=unknown', url.origin));
    }
}

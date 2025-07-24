// /middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
    const res = NextResponse.next()
    const supabase = createMiddlewareClient({ req, res })

    // Refresh session if expired - required for Server Components
    await supabase.auth.getSession()

    // Protected routes
    const protectedPaths = ['/dashboard', '/editor', '/settings']
    const isProtectedRoute = protectedPaths.some(path =>
        req.nextUrl.pathname.startsWith(path)
    )

    const {
        data: { session },
    } = await supabase.auth.getSession()

    // Redirect if accessing protected route without session
    if (isProtectedRoute && !session) {
        const redirectUrl = new URL('/login', req.url)
        redirectUrl.searchParams.set('redirectedFrom', req.nextUrl.pathname)
        return NextResponse.redirect(redirectUrl)
    }

    return res
}

// Configure which routes to run middleware on
export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        '/((?!_next/static|_next/image|favicon.ico|public/).*)',
    ],
}
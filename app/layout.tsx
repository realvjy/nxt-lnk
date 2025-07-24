// app/layout.tsx
import '../styles/global.scss'  // Add this back
import type { ReactNode } from 'react'
import { cn } from "@/lib/utils/utils"
import { Inter } from "next/font/google"
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { SupabaseProvider } from '@/components/providers/SupabaseProvider'

const inter = Inter({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-inter",
})

export const metadata = {
    title: "vjy.me",
    description: "Link-in-bio by Vijay Verma",
}

export default async function RootLayout({ children }: { children: ReactNode }) {
    const supabase = createServerComponentClient({ cookies })

    // Get initial session
    const {
        data: { session },
    } = await supabase.auth.getSession()

    return (
        <html lang="en" className={inter.variable}>
            <body className={cn("bg-background text-foreground")}>
                <SupabaseProvider>
                    {children}
                </SupabaseProvider>
            </body>
        </html>
    )
}
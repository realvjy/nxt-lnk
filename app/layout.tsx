// app/layout.tsx
import '../styles/global.scss'
import "tw-animate-css";
import type { ReactNode } from 'react'
import { cn } from "@/lib/utils"
import { Inter } from "next/font/google"
import StoreInitializer from '@/components/StoreInitializer'

const inter = Inter({
    subsets: ["latin"],
    display: "swap", // optional but recommended
    variable: "--font-inter", // optional for CSS usage
})

export const metadata = {
    title: "vjy.me",
    description: "Link-in-bio by Vijay Verma",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className={inter.className}>
            <body className={cn("bg-background text-foreground")}>
                <StoreInitializer />
                {children}
            </body>
        </html>
    )
}
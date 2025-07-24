// app/layout.tsx
import '../styles/global.scss'
import type { ReactNode } from 'react'
import { cn } from "@/lib/utils/utils"
import { Inter } from "next/font/google"

const inter = Inter({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-inter",
})

export const metadata = {
    title: "vjy.me",
    description: "Link-in-bio by Vijay Verma",
}

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en" className={inter.variable}>
            <body className={cn("bg-background text-foreground")}>
                {children}
            </body>
        </html>
    )
}

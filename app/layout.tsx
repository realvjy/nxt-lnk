// app/layout.tsx
import '../styles/global.scss'
import "tw-animate-css";
import type { ReactNode } from 'react'

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    )
}

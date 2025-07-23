import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './app/**/*.{ts,tsx}',
        './pages/**/*.{ts,tsx}',
        './components/**/*.{ts,tsx}',
        './styles/**/*.{css,scss}', // includes your global file
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ["var(--font-inter)"],
            },
        },
    },
}

export default config

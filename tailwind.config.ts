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
            colors: {
                debug: '#ff00ff',
            },
            animation: {
                fadeIn: 'fadeIn 0.5s ease-in-out',
            },
            keyframes: {
                fadeIn: {
                    from: { opacity: '0' },
                    to: { opacity: '1' },
                },
            },
        },
    },
}

export default config

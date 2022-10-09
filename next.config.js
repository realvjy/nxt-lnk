/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    optimizeFonts: false, async rewrites() {
        return [
            {
                source: '/(links|lnk|l)',
                destination: '/',
            },
        ]
    },
}

module.exports = nextConfig

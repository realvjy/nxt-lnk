/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    optimizeFonts: false, async rewrites() {
        return [
            {
                source: '/(tw|lnk|ins|fb|db|insta|be)',
                destination: '/links',
            },
        ]
    },
}

module.exports = nextConfig

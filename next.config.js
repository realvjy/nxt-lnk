/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    compiler: {
        // ssr and displayName are configured by default
        styledComponents: true,
    },
    images: {
        domains: [
            'vjy.me',
            'lh3.googleusercontent.com',
            'avatars.githubusercontent.com',
            'images.unsplash.com',
            'xsgames.co',
            'i.pravatar.cc',
            'picsum.photos',
            'placehold.co',
            'cloudflare-ipfs.com',
            'loremflickr.com',
            'eckfdxrlyrnllsdidpqs.supabase.co' // Add your Supabase project domain here
        ]
    },
    optimizeFonts: false,
    async rewrites() {
        return [
            {
                source: '/(links|lnk|l)',
                destination: '/',
            },
        ]
    },
}

module.exports = nextConfig

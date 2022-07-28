import { NextSeo } from 'next-seo';

export default function Seo({ page }) {
    const { title, excerpt, slug, coverImage } = page;
    return (
        <>
            <NextSeo
                title={title}
                description={excerpt}
                canonical={`https://vjy.me`}
                openGraph={{
                    type: 'website',
                    url: 'https://vjy.me',
                    title: `${title}`,
                    description: 'A Design Wizard | Creating NFT arts | Making opensource design resources 2D/3D | Voyaging in the Metaverse | Sushi Design System, designletter, 3dicons...',
                    locale: 'en_EN',
                    images: [
                        {
                            url: coverImage,
                            alt: `${title}`,
                        },
                    ],
                    site_name: 'vjy.me',
                }}
                twitter={{
                    handle: '@realvjy',
                    site: 'vjy.me',
                    cardType: 'summary_large_image',
                }}
            />
        </>
    );
}
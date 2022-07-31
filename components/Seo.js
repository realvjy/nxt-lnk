import { NextSeo } from 'next-seo';

export default function Seo({ page }) {
    const { title, excerpt, slug, coverImage } = page;
    return (
        <>
            <NextSeo
                title={title}
                titleTemplate="realvjy ✦ design wizard"
                defaultTitle="realvjy ✦ design wizard"
                description='Design Wizard | Creating NFT arts | Making opensource design resources 2D/3D | Voyaging in the Metaverse | Sushi Design System, designletter, 3dicons...'
                canonical={`https://vjy.me`}
                openGraph={{
                    type: 'website',
                    url: 'https://vjy.me',
                    title: `${title}`,
                    description: 'Design Wizard | Creating NFT arts | Making opensource design resources 2D/3D | Voyaging in the Metaverse | Sushi Design System, designletter, 3dicons...',
                    locale: 'en_EN',
                    images: [
                        {
                            width: 1200,
                            height: 630,
                            url: `https://vjy.me/preview.jpg`,
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
                additionalMetaTags={[{
                    name: 'keywords',
                    content: 'designer, product designer, illustrator, indian designer, vijay verma, realvjy, illlustrations, indian illustrator, ui designer india, sushi design system, zomato designer, 3dicons, uiprint, vijay realvjy, indian ui designer, design india, overlayz, nft art'
                },
                {
                    name: 'twitter:image',
                    content: `https://vjy.me/preview.jpg`
                },
                {
                    httpEquiv: 'x-ua-compatible',
                    content: 'IE=edge; chrome=1'
                }]}
                robotsProps={{
                    nosnippet: false,
                    notranslate: true,
                    noimageindex: false,
                    noarchive: false,
                    notranslate: false,
                    maxSnippet: -1,
                    maxImagePreview: 'large',
                    maxVideoPreview: -1,
                }}
            />
        </>
    );
}
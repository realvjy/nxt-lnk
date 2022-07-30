import { useState, useEffect } from "react"
import useDarkMode from "use-dark-mode"
import Head from "next/head";
import { ThemeProvider } from "styled-components";
import Layout from "../components/Layout";
import GlobalStyle from "../styles/GlobalStyle";
import { darkTheme, lightTheme } from "../styles/theme.config";
import { GoogleAnalytics } from "nextjs-google-analytics";
import { DefaultSeo } from 'next-seo';

function MyApp({ Component, pageProps }) {
    const darkMode = useDarkMode(false, { storageKey: null, onChange: null })
    const [isMounted, setIsMounted] = useState(false)

    // const [theme, setTheme] = useState(lightTheme)
    const theme = darkMode.value ? darkTheme : lightTheme;

    useEffect(() => {
        setIsMounted(true);
    }, [])

    return (
        <>
            <GoogleAnalytics />
            <ThemeProvider theme={theme}>
                <Head>
                    <meta content="width=device-width, initial-scale=1" name="viewport" />
                    <link rel="icon" href="/favicon.ico" />

                </Head>
                <GlobalStyle />
                <Layout>
                    <DefaultSeo
                        description='A Design Wizard | Creating NFT arts | Making opensource design resources 2D/3D | Voyaging in the Metaverse | Sushi Design System, designletter, 3dicons...'
                        canonical={`https://vjy.me`}
                        openGraph={{
                            type: 'website',
                            url: 'https://vjy.me',
                            description: 'A Design Wizard | Creating NFT arts | Making opensource design resources 2D/3D | Voyaging in the Metaverse | Sushi Design System, designletter, 3dicons...',
                            locale: 'en_EN',
                            images: [
                                {
                                    width: 1200,
                                    height: 630,
                                    url: `https://vjy.me/preview.jpg`,
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
                    />
                    {isMounted && <Component {...pageProps} />}
                </Layout>
            </ThemeProvider>
        </>

    )
}
export default MyApp
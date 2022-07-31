import { useState, useEffect } from "react"
import useDarkMode from "use-dark-mode"
import Head from "next/head";
import { ThemeProvider } from "styled-components";
import Layout from "../components/Layout";
import GlobalStyle from "../styles/GlobalStyle";
import { darkTheme, lightTheme } from "../styles/theme.config";
import { GoogleAnalytics } from "nextjs-google-analytics";
import { DefaultSeo } from 'next-seo';
import SEO from '../next-seo.config';

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
                        description='Design Wizard | Creating NFT arts | Making opensource design resources 2D/3D | Voyaging in the Metaverse | Sushi Design System, designletter, 3dicons...'
                        canonical={`https://vjy.me`}
                        {...SEO}
                        additionalMetaTags={[{
                            name: 'keywords',
                            content: 'designer, product designer, illustrator, indian designer, vijay verma, realvjy, illlustrations, indian illustrator, ui designer india, sushi design system, zomato designer, 3dicons, uiprint, vijay realvjy, indian ui designer, design india, overlayz, nft art'
                        },
                        {
                            name: 'twitter:image',
                            content: `https://vjy.me/preview.jpg`
                        },
                        {
                            name: 'twitter:title',
                            content: 'realvjy ✦ A design wizard',
                        },
                        {
                            name: 'twitter:description',
                            content: 'Design Wizard | Creating NFT arts | Making opensource design resources 2D/3D | Voyaging in the Metaverse | Sushi Design System, designletter, 3dicons...'
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
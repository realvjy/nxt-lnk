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
                        openGraph={{
                            type: 'website',
                            locale: 'en_IE',
                            url: 'https://www.url.ie/',
                            site_name: 'SiteName',
                        }}
                        twitter={{
                            handle: '@handle',
                            site: '@site',
                            cardType: 'summary_large_image',
                        }}
                    />
                    {isMounted && <Component {...pageProps} />}
                </Layout>
            </ThemeProvider>
        </>

    )
}
export default MyApp
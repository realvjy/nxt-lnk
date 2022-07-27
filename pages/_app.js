import { useState, useEffect } from "react"
import useDarkMode from "use-dark-mode"
import Head from "next/head";
import { ThemeProvider } from "styled-components";
import Layout from "../components/Layout";
import GlobalStyle from "../styles/GlobalStyle";
import { darkTheme, lightTheme, lfgTheme } from "../styles/theme.config";

function MyApp({ Component, pageProps }) {
    const [isMounted, setIsMounted] = useState(false)
    const darkmode = useDarkMode(true)
    const theme = lightTheme

    useEffect(() => {
        setIsMounted(true)
    }, [])


    return (
        <ThemeProvider theme={theme}>
            <Head>
                <meta content="width=device-width, initial-scale=1" name="viewport" />
                <link rel="icon" href="/favicon.ico" />
                <title>Overlayz Studio</title>
            </Head>
            <GlobalStyle />
            <Layout>
                {isMounted && <Component {...pageProps} />}
            </Layout>
        </ThemeProvider>
    )
}
export default MyApp
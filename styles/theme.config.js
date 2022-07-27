import GlobalStyle from "./GlobalStyle"

GlobalStyle
const light = {
    bg: {
        primary: `var(--white)`,
        secondary: '#ffffff',
        inset: '#e2e4e8',
        input: 'rgba(65,67,78,0.12)',
    },
    text: {
        primary: `var(--black)`,
        secondary: '#ffffff',
        tertiary: '#525560',
        quarternary: '#9194a1',
        placeholder: 'rgba(82,85,96,0.5)',
        onPrimary: '#ffffff',
    },
}

const dark = {
    bg: {
        primary: `var(--black)`,
        secondary: `var(--white)`,
        inset: '#111111',
        input: 'rgba(191,193,201,0.12)',
    },
    text: {
        primary: `var(--white)`,
        secondary: '#e3e4e8',
        tertiary: '#a9abb6',
        quarternary: '#6c6f7e',
        placeholder: 'rgba(145,148,161,0.5)',
        onPrimary: '#050505',
    },
    // ...
}

const defaultTheme = {
    fontSizes: [
        '14px', // 0
        '16px', // 1
        '18px', // 2
        '22px', // 3
        '26px', // 4
        '32px', // 5
        '40px', // 6
    ],
    fontWeights: {
        body: 400,
        subheading: 500,
        link: 600,
        bold: 700,
        heading: 800,
    },
    lineHeights: {
        body: 1.5,
        heading: 1.3,
        code: 1.6,
    },
    deviceSize: {
        mobileS: '320px',
        mobileM: '375px',
        mobileL: '425px',
        tablet: '768px',
        laptop: '1024px',
        laptopL: '1440px',
        desktop: '2560px'
    },
    // ...
}

export const lightTheme = { ...defaultTheme, ...light }
export const darkTheme = { ...defaultTheme, ...dark }
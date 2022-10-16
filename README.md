# Next Lnks

next lnks is created as custom alternative for linktree, bio and other shortner platform. Check live version here [vjy.me/lnk](https://vjy.me/lnk)

Pull requests are very welcome. Also make sure to check out the issues for feature requests if you are looking for inspiration on what to add.

Coffee fuels coding ☕️

<a href="https://www.buymeacoffee.com/realvjy" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>

**Table of Contents**
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
  - [Usage](#usage)
  - [Quick Start](#quick-start)
  - [Manual Setup](#manual-setup)
  - [Getting Started](#getting-started)
  - [Images](#images)
  - [Bio Info](#bio-info)
    - [Add/Update](#add-update-bio)
    - [Enable/Disable](#enable-disable)
  - [Update Links](#update-links)
    - [Enable/Disable](#enable-disable)
    - [Add/Update](#add-update)
  - [Custom Domain](#custom-domain)
  - [Contributors](#contributors)
  
  
## Usage
`next-lnks` template used to create your custom bio link and self-host on Vercel or Netlify using your own domain. Need little understanding of code :) ☕

Usually, you don't need to worry a lot about coding if you're just updating information in `BioData.js` and `LinkData.js`. To deep dive know more  [Next.js](https://nextjs.org/docs) and [React](https://reactjs.org/docs/getting-started.html) official documentaion.

For customization used stylesheet component.  If you want to customize css you can [learn more here](https://styled-components.com/).

Template auto support dark-mode depending on system cofig.

## Quick Start
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/import/git?s=https://github.com/realvjy/next-lnks) [![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/realvjy/next-lnks)


## Manual Setup
Run the following command to create a new project with this template:
```bash
yarn create next-app your-app-name -e https://github.com/realvjy/next-lnks
# or
npx create-next-app your-app-name -e https://github.com/realvjy/next-lnks
```

## Getting Started
First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

**Important files to edit or update info**
`data/BioData.js` All basic info update here
`data/LinksData.js` Contain all the links
`Components/WebLinks.js` UI and stylesheet
`Components/icons/index.js` Contain all SVG icon compo

You can start editing the page by modifying `data/BioData.js` and `data/LinksData.js`. The page auto-updates as you edit the file.



## Images
All images stored inside `public` folder of the project.

## Update Bio
**Example from** `BioData.js` :
```jsx
const bioData = [
    {
        name: 'vijay verma',
        username: '@realvjy',
        url: 'https://vjy.me',
        titleImg: true,
        avatar: '/avatar.png',
        nftAvatar: true,
        description: 'A short description/bio about you goes here',
        subdesc: 'This is secondary description. If you do not need, you can remove it',
        newProductUrl: 'https://vjy.me/lnk',
        newProduct: true,
    },
];

export default bioData;
```
**Avatar**
Just replace `avatar.png`. 200x200px will be good.

**Hex/NFT avatar view**
`nftAvatar: true` enable hex shape on avatar image.
`nftAvatar: false` made it in oval shape.

**Title**
By default `titleImg: true` and it look for `title.svg`. Replace svg with logo **logo**. Make sure to use `title.svg ` name.

**Featured banner**
`newProductUrl` and `newProduct` used for getting featured banner. You can replace the image `newproduct.png`  with any design you like.

`newProduct: true` show banner. Default is `true` make it false to hide.


## Update Links
**Example from** `LinksData.js` :
```jsx
const webLinks = [
    // All social profile
    {
        title: 'Twitter',
        url: 'https://twitter.com/realvjy',
        type: 'social',
        icon: '/twitter.svg',
        on: true
    },
    ...
    ...
    
    {
        title: 'Instagram',
        url: 'https://instagram.com/realvjy',
        type: 'social',
        icon: '/insta.svg',
        on: true
    }
];
export default webLinks;
```
**Enable/Disable Social Media**
Find `type: social` and change `on:true|false`

| title           | on (default)    | 
| ---------       | --------        | 
| `Twitter`       | `true`          | 
| `Instagram`     | `true`          | 
| `Dribbble`      | `false`          | 
| `Medium`        | `false`          | 
| `Github`        | `true`          | 
| `Youtube`       | `false`          | 
| `Behance`       | `true`          | 
| `Figma`         | `true`          | 
| `Linkedin`      | `false`          | 

Setting `on: true` show the social icon. 
The social media icons are arranged in a single row at the top of the page below description. If you want to use as list, chagne type to `type: 'other'`

**Add new Social Media link**
create a new block by copying this
```jsx
    {
        title: 'Social Name',
        url: 'https://link.com/whateverurl',
        type: 'social',
        icon: '/newicon.svg',
        on: true
    }
```
Update all info and make sure to add a icon.svg file in [public](#images) folder.

## Custom Domain
It's very simple. Vercel give you option to just add any domain to the deployed project like [vjy.me/lnk](https://vjy.me/lnk) or this project itself [nxtlnk.xyz](https://nxtlnk.xyz). All you have to do is follow official [Vercel documentaion](https://vercel.com/docs/concepts/projects/domains/add-a-domain) or [Netlify Documentaion](https://www.netlify.com/blog/2021/12/20/how-to-add-custom-domains-to-netlify-sites/)



## Contributors

[Contributing Guide](./CONTRIBUTING.md)

A massive thank you to [everyone who contributes]() to this project 👏
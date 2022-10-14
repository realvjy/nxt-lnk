# Next Lnks

next lnks is created as custom alternative for linktree, bio and other shortner platform. Check live version here [vjy.me/lnk](https://vjy.me/lnk)

Pull requests are very welcome. Also make sure to check out the issues for feature requests if you are looking for inspiration on what to add.

Coffee fuels coding ☕️

<a href="https://www.buymeacoffee.com/realvjy" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>

**Table of Contents**
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
  - [Usage](#usage)
  - [Setup](#setup)
  - [Images](#images)
  - [Bio Info](#bio-info)
    - [Add/Update](#add-update-bio)
    - [Enable/Disable](#enable-disable)
  - [Update Links](#update-links)
    - [Enable/Disable](#enable-disable)
    - [Add/Update](#add-update)
  - [Contributors](#contributors)
  
  
## Usage
`next-lnks` works by including it on pages where you would 

## Quick Start
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/project?template=https://github.com/realvjy/next-lnks) [![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/realvjy/next-lnks)


## Setup
Run the following command to create a new project with this template:
```
yarn create next-app your-name -e https://github.com/realvjy/next-lnks
```
**or**
```
npx create-next-app your-name -e https://github.com/realvjy/next-lnks
```

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

## Contributors

[Contributing Guide](./CONTRIBUTING.md)

A massive thank you to [everyone who contributes]() to this project 👏
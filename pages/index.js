import Head from 'next/head'
import Image from 'next/image'
import styled from "styled-components";
import { NextSeo } from 'next-seo';
import WebLinks from '../components/WebLinks';
import Header from '../components/Header';
import { HexIcon, HomeIcon, NewUp } from '../components/icons';

import vercel from '../public/vercel.svg';
import PFP from '../public/realvjy-nft.png'

export default function Home() {
  const x = HexIcon.x
  console.log(x);
  return (
    <>
      <Head>
        <title>@realvjy - A design Wizard </title>
      </Head>
      <WebLinks />
    </>
  )
}


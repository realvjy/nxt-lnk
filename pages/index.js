import Head from 'next/head'
import Image from 'next/image'
import styled from "styled-components";
import { NextSeo } from 'next-seo';
import WebLinks from '../components/WebLinks';
import { HexIcon, HomeIcon, NewUp } from '../components/icons';

import vercel from '../public/vercel.svg';
import Seo from '../components/Seo';

export default function Home() {
  const page = {
    title: 'realvjy ✦ A design wizard',
    excerpt: 'home',
    slug: '/',
    coverImage: 'https://vjy.me/preview.jpg'
  };
  return (
    <>
      <Seo page={page} />
      <WebLinks />
    </>
  )
}


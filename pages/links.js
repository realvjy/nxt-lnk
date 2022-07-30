import Head from 'next/head'
import Image from 'next/image'
import styled from "styled-components";
import { NextSeo } from 'next-seo';
import WebLinks from '../components/WebLinks';
import Header from '../components/Header';
import { HexIcon, HomeIcon, NewUp } from '../components/icons';
import Seo from '../components/Seo';

export default function Links() {
    const page = {
        title: 'realvjy ✦ links',
        excerpt: 'home',
        slug: '/',
        coverImage: '/preview.jpg'
    };
    return (
        <>
            <Seo page={page} />
            <WebLinks />
        </>
    )
}


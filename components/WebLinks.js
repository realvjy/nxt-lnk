// Weblinks Page Sections
// created by @realvjy
// date: 29 Jul, 2022

import Image from "next/image";
import styled from "styled-components";
import { Button, ButtonLink, Container, StyledLink } from "./ReusableStyles";
import Link from "next/link";
import { ChevronRightIcon, HexIcon, HomeIcon, TwitterIcon, NewUp, OvalIcon } from './icons';
import allLinks from "../data/LinksData";
import bioData from "../data/BioData";
import realvjyNFT from "../public/avatar.png";

const Links = () => {

  // Collect user info from bioData
  const name = bioData[0].name;
  const username = bioData[0].username;
  const titleImg = bioData[0].titleImg;
  const avatarImg = bioData[0].avatar;
  const description = bioData[0].description;
  const current = bioData[0].current;

  // Check what class to use oval or hex for avatar
  const avatarShape = bioData[0].nftAvatar ? `nft-clipped` : `oval-clipped`

  // Collect all links filter by type - social, project, nft and other
  const social = allLinks.filter((el) => {
    return el.type === "social"
  });
  const installs = allLinks.filter((el) => {
    return el.type === "install"
  });

  const newProduct = bioData[0].newProduct; // checking for newProduct flag true false
  const newProductUrl = bioData[0].newProductUrl; // get product url if available


  const demos = allLinks.filter((el) => {
    return el.type === "demo"
  });
  const others = allLinks.filter((el) => {
    return el.type === "other"
  });

  return (
    <LinkWrapper>
      <LinkContainer>
        <TopPart>
          <LinkHeader>
            <Avatar>
              <AvatarWrap>
                <HexIcon />
                <OvalIcon />
                <div className={`${avatarShape} avatar-border`}>
                </div>
                <div className={`${avatarShape} avatar-fill`}>
                </div>
                <img
                  src={avatarImg}
                  className={avatarShape}
                />

              </AvatarWrap>
            </Avatar>
            <Title>
              {/* Uncomment h1, h3 or both if you don't want to use image as title */}
              <img
                src={titleImg}
                className="handle"
              />
              {/* <h1>{username}</h1>
              <h3>{name}</h3> */}

            </Title>
          </LinkHeader>
          <LinkBio>
            <h1>
              {/* {description}  // Not used because I want to customize dots between text */}
              {description ? description : <>Fall back text if description not in BioData.js</>}
            </h1>

            {/* Uncomment these if want to add more details about */}
            <h4>
              {/* // Not used because I want href. */}
              {current}
              {/* Currently building what I love <a href="https://overlayz.studio">@overlayz</a> */}
            </h4>

          </LinkBio>
          <WebLinkWrap>
            <LinkSection className="social">
              <h3>Social Media</h3>
              <div className="iconsonly">
                {
                  social.map((i) => {
                    return (
                      <a href={i.url} key={i.title}>
                        <LinkBox className="socialIcon">
                          <img src={i.icon} style={{ filter: 'var(--img)' }} />
                        </LinkBox>
                      </a>
                    )
                  })
                }


              </div>
            </LinkSection>


            <LinkSection>
              <h3>Install</h3>


              {
                installs.map((i) => {
                  return (
                    <Link href={i.url} passHref key={i.title}>
                      <LinkBox>
                        <LinkTitle><img src={i.icon} style={{ filter: 'var(--img)' }} /> {i.title}</LinkTitle> <NewUp />
                      </LinkBox>
                    </Link>
                  )
                })
              }
            </LinkSection>

            <LinkSection>
              <h3>Other</h3>
              {/* New Section will render once newProduct == true */}
              {(newProduct) ? <NewSection>
                <Link href={newProductUrl} passHref >
                  <img
                    src={'/newproduct.png'}
                    className="newproduct"
                  />
                </Link>
              </NewSection> : ''
              }
              {
                others.map((i) => {
                  return (
                    <Link href={i.url} passHref key={i.title}>
                      <LinkBox>
                        <LinkTitle><img src={i.icon} /> {i.title}</LinkTitle> <NewUp />
                      </LinkBox>
                    </Link>
                  )
                })
              }
            </LinkSection>
          </WebLinkWrap>
        </TopPart>
        <BottomPart>
          <LinkFoot>
            <h4>made by <a href="https://twitter.com/realvjy">{username}</a> </h4>
          </LinkFoot>
        </BottomPart>

      </LinkContainer>
    </LinkWrapper>

  )
};

export default Links;

const LinkWrapper = styled(Container)`
`
const LinkContainer = styled.div`
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    text-align: center;
    padding: 24px;
`

const LinkHeader = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 60px;
    margin-bottom: 24px;
    @media screen and (max-width: ${({ theme }) => theme.deviceSize.tablet}) {
       margin-top: 20px;
    }
`

const Avatar = styled.div`
    height: 90px;
    width: 90px;
    position: relative;
    margin-bottom: 12px;
`

const AvatarWrap = styled.div`
   height: 100%;
   width: 100%;
   filter: drop-shadow(0px 1px 2px var(--avatar-shadow));
   img{
    height: calc(100% - 6px);
    width: calc(100% - 6px);
   }
   .avatar-border{
        height: 100%;
        width: 100%;
        position: absolute;
        background: ${({ theme }) => theme.bg.primary};
   }
   .avatar-fill{
        height: calc(100% - 6px);
        width: calc(100% - 6px);
        position: absolute;
        background: ${({ theme }) => theme.bg.primary};
   }
`

const Title = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    h1{
      font-size: 38px;
      font-weight: 800;
      background: linear-gradient(90deg, #4AB1F1 5.71%, #566CEC 33.77%, #D749AF 61.82%, #FF7C51 91.21%), #000000;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    h3{
      font-size: 22px;
      letter-spacing: -.7px;
      color: ${({ theme }) => theme.text.secondary};
    }
    
    img{
    }
    .name{
      margin-top: 8px;
      @media screen and (max-width: ${({ theme }) => theme.deviceSize.tablet}) {
        width: 140px;
      }
    }
    .handle{
      height: 32px;
      margin-top: 6px;
      @media screen and (max-width: ${({ theme }) => theme.deviceSize.tablet}) {
        height: 28px;
      }
    }
`

const LinkBio = styled.div`
    display: flex;
    flex-direction: column;
    h1{
      font-size: 24px;
      line-height: 30px;
      font-weight: 500;
      letter-spacing: -0.6px;
      padding: 0 20px;
      @media screen and (max-width: ${({ theme }) => theme.deviceSize.tablet}) {
        font-size: 20px;
        line-height: 20px;
        padding: 0 8px;

      }
      vertical-align: middle;
      span{
        font-size: 12px;
        vertical-align: bottom;
        line-height: 30px;
        color: ${({ theme }) => theme.text.secondary};
        margin: 0 2px;
        @media screen and (max-width: ${({ theme }) => theme.deviceSize.tablet}) {
          font-size: 10px;
          line-height: 20px;
        }
      }
    }
    h4{
      font-size: 20px;
      letter-spacing: -.5px;
      margin: 12px 0;
      color: ${({ theme }) => theme.text.secondary};
      font-weight: 500;
        @media screen and (max-width: ${({ theme }) => theme.deviceSize.tablet}) {
          font-size: 15px;
          padding: 0 20px;
          line-height: 24px;
        }
      a{
         font-weight: 700;
         opacity: .7;
         &:hover{
          opacity: 1;
         }
      }
    }

`

const TopPart = styled.div`
    
`



const BottomPart = styled.div`
    margin-bottom: 40px;
    
`
const LinkFoot = styled.div`
    h4{
      color: ${({ theme }) => theme.text.secondary};
      line-height: 32px;
      letter-spacing: -.2px;
      font-size: 16px;
      font-weight: 500;
      @media screen and (max-width: ${({ theme }) => theme.deviceSize.tablet}) {
        font-size: 12px;
      }
      span{
        font-size: 10px;
        vertical-align: bottom;
        line-height: 32px;
        margin: 0 2px;
        opacity: .6;
        @media screen and (max-width: ${({ theme }) => theme.deviceSize.tablet}) {
          font-size: 8px;
        }
      }
    }
`

const WebLinkWrap = styled.div`
    padding: 24px 80px;
    @media screen and (max-width: ${({ theme }) => theme.deviceSize.tablet}) {
       padding: 12px;
    }
`


const LinkSection = styled.div`
    padding: 12px 0;
    display: flex;
    flex-direction: column;
    .iconsonly{
      display: flex;
      justify-content: center;
      margin-bottom: 8px;
      @media screen and (max-width: ${({ theme }) => theme.deviceSize.tablet}) {
        flex-wrap: wrap;
      }
    }
    h3{
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 4px;
      margin-bottom: 4px;
      color: ${({ theme }) => theme.text.secondary};
      @media screen and (max-width: ${({ theme }) => theme.deviceSize.tablet}) {
        font-size: 11px;
      }
    }
`

const LinkBox = styled.div`
    padding: 18px 20px;
    border-radius: 12px;
    margin: 8px 18px;
    border: 1px solid ${({ theme }) => theme.bg.secondary};
    flex-direction: row;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    font-size: 16px;
    font-weight: 600;
    letter-spacing: -.5px;
    position: relative;
    text-align: center;
    position: relative;
    
    &::before{
      content: "";
      border-radius: 12px;
      display: block;
      position: absolute;
      z-index: -1;
      inset: -2px;
      opacity: 0;
      transform: scale(0.8);
    }
    &:hover{
    transition: all 333ms ease 0s;
    border-color: transparent;
      &::before{
        opacity: 1;
        background: ${({ theme }) => theme.bg.hover};
        transition: all 333ms ease 0s;
        transform: scale(1);
      }
    }
    .new-up{
      transform: scale(.8);
      opacity: .7;
    }
    
    &.socialIcon{
      padding: 16px;
      border-radius: 50%;
      border: none;
      margin: 4px;
      img{
        height: 24px;
      }
     
      @media screen and (max-width: ${({ theme }) => theme.deviceSize.tablet}) {
        padding: 10px;
        margin: 2px;
        img{
          height: 20px;
        }
      }
    }
    @media screen and (max-width: ${({ theme }) => theme.deviceSize.tablet}) {
      padding: 12px 16px;
      font-size: 16px;
    }
`
const LinkTitle = styled.div`
  display: flex;
  font-size: 18px;
  align-items: center;
    @media screen and (max-width: ${({ theme }) => theme.deviceSize.tablet}) {
      font-size: 14px;
    }
    img{
      height: 20px;
      margin-right: 10px;
    }
`

const NewSection = styled.div`
  display: flex;
  align-items: center;
  padding: 16px 20px;
    img{
      width: 100%;
      border: 1px solid ${({ theme }) => theme.bg.secondary};
      border-radius: 12px;
      cursor: pointer;
      &:hover{
       transform: scale(1.01);
      }
    }
`
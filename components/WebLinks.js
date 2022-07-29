import Image from "next/image";
import styled from "styled-components";
import { Button, ButtonLink, Container, StyledLink } from "./ReusableStyles";
import Link from "next/link";
import { ChevronRightIcon, HexIcon, HomeIcon, TwitterIcon, NewUp } from './icons';
import allLinks from "./LinksData";
import realvjyNFT from "../public/realvjy-nft.png";

const Links = () => {
  const social = allLinks.filter((el) => {
    return el.type === "social"
  });
  const projects = allLinks.filter((el) => {
    return el.type === "project"
  });
  const nfts = allLinks.filter((el) => {
    return el.type === "nft"
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
                <div className="clipped avtar-border">
                </div>
                <div className="clipped avtar-border-fill">
                </div>
                <img
                  src={'/realvjy-nft.png'}
                  className="clipped"
                />

              </AvatarWrap>
            </Avatar>
            <Title>

              <img
                src={'/realvjy.svg'}
                className="handle"
              />
            </Title>
          </LinkHeader>
          <LinkBio>
            <h1>A Design Wizard <span>✦</span> Making Open source designs 2D/3D <span>✦</span> Creating NFT arts <span>✦</span> Voyaging in the Metaverse</h1>
            {/* <h4>Currently building what I love <a href="#">@overlayz</a></h4> */}
          </LinkBio>
          <WebLinkWrap>
            <LinkSection className="social">
              <h3>SOCIAL MEDIA</h3>
              <div className="iconsonly">
                {
                  social.map((i) => {
                    return (
                      <Link href={i.url} passHref key={i.title}>
                        <LinkBox className="socialIcon">
                          <img src={i.icon} style={{ filter: 'var(--img)' }} />
                        </LinkBox>
                      </Link>
                    )
                  })
                }


              </div>
            </LinkSection>
            <NewSection>
              <Link href={'https://www.figma.com/community/widget/1128028298799358676/Random-Hues'} passHref >
                <img
                  src={'/new-randomhue.png'}
                  className="handle"
                />
              </Link>

            </NewSection>
            <LinkSection>
              <h3>NFTs</h3>
              {
                nfts.map((i) => {
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
              <h3>Projects</h3>
              {
                projects.map((i) => {
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
            <LinkSection>
              <h3>Other</h3>
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
            <h4>©realvjy <span>✦</span> vijay verma</h4>
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
   img{
    height: calc(100% - 6px);
    width: calc(100% - 6px);
   }
   .avtar-border{
        height: 100%;
        width: 100%;
        position: absolute;
        background: ${({ theme }) => theme.text.primary};
   }
   .avtar-border-2{
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
    img{
    }
    .name{
      margin-top: 8px;
      @media screen and (max-width: ${({ theme }) => theme.deviceSize.tablet}) {
        width: 140px;
      }
    }
    .handle{
      width: 120px;
      margin-top: 6px;
      @media screen and (max-width: ${({ theme }) => theme.deviceSize.tablet}) {
        width: 92px;
      }
    }
`

const LinkBio = styled.div`
    display: flex;
    flex-direction: column;
    h1{
      font-size: 22px;
      line-height: 30px;
      font-weight: 500;
      letter-spacing: -0.6px;
      padding: 0 20px;
      @media screen and (max-width: ${({ theme }) => theme.deviceSize.tablet}) {
        font-size: 16px;
        line-height: 20px;
        padding: 0 8px;

      }
      vertical-align: middle;
      span{
        font-size: 14px;
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
      color: var(--light-black);
      font-weight: 500;
        @media screen and (max-width: ${({ theme }) => theme.deviceSize.tablet}) {
          font-size: 18px;
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
      span{
        font-size: 12px;
        vertical-align: bottom;
        line-height: 32px;
        margin: 0 2px;
        opacity: .6;
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
      @media screen and (max-width: ${({ theme }) => theme.deviceSize.tablet}) {
        flex-wrap: wrap;
      }
    }
    h3{
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 3px;
      color: ${({ theme }) => theme.text.secondary};
      @media screen and (max-width: ${({ theme }) => theme.deviceSize.tablet}) {
        font-size: 12px;
      }
    }
`

const LinkBox = styled.div`
    padding: 16px 20px;
    border-radius: 12px;
    margin: 8px 18px;
    border: 1px solid ${({ theme }) => theme.bg.secondary};
    flex-direction: row;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    font-size: 18px;
    font-weight: 600;
    letter-spacing: -.5px;
    position: relative;
    text-align: center;
    &:hover{
      background-color: ${({ theme }) => theme.bg.tertiary};
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
      opacity: .8;
      img{
        height: 24px;
      }
      &:hover{
        opacity: 1;
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
  align-items: center;
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
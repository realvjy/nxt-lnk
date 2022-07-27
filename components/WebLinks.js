import Image from "next/image";
import styled from "styled-components";
import { Button, ButtonLink, Container, StyledLink } from "./ReusableStyles";
import Link from "next/link";
import { ChevronRightIcon, HexIcon, HomeIcon, TwitterIcon, NewUp } from './icons';
import allLinks from "./LinksData";
import realvjyNFT from "../public/realvjy-nft.png";

const Links = () => {

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
                <img
                  src={'/realvjy-nft.png'}
                  className="clipped"
                />

              </AvatarWrap>
            </Avatar>
            <Title>
              <img
                src={'/vijay-verma.svg'}
                className="name"
              />
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
            {
              allLinks.map((i) => {
                return (
                  <Link href={"/"} passHref key={i}>
                    <LinkBox>
                      <TwitterIcon /> {i.title} <NewUp />
                    </LinkBox>
                  </Link>
                )
              })
            }
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
    margin-top: 150px;
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
`

const Title = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    img{
    }
    .name{
      margin-top: 8px;
    }
    .handle{
      width: 96px;
      margin-top: 6px;
    }
`

const LinkBio = styled.div`
    display: flex;
    flex-direction: column;
    h1{
      font-size: 24px;
      line-height: 32px;
      font-weight: 500;
      letter-spacing: -0.6px;
      padding: 0 20px;
      @media screen and (max-width: ${({ theme }) => theme.deviceSize.tablet}) {
        font-size: 18px;
        line-height: 24px;
        padding: 0 8px;

      }
      vertical-align: middle;
      span{
        font-size: 14px;
        vertical-align: bottom;
        line-height: 32px;
        color: var(--light-black);
        margin: 0 2px;
        @media screen and (max-width: ${({ theme }) => theme.deviceSize.tablet}) {
          font-size: 10px;
          line-height: 24px;
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
      color: var(--light-black);
      line-height: 32px;
      letter-spacing: -.2px;
      span{
        font-size: 12px;
        vertical-align: bottom;
        line-height: 32px;
        color: var(--light-black);
        margin: 0 2px;
      }
    }
`

const WebLinkWrap = styled.div`
    padding: 24px 80px;
    @media screen and (max-width: ${({ theme }) => theme.deviceSize.tablet}) {
       padding: 24px 12px;
    }
`

const LinkBox = styled.div`
    padding: 12px 20px;
    border-radius: 12px;
    border: 1.5px solid ${({ theme }) => theme.bg.secondary};
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    margin: 18px;
    font-size: 18px;
    font-weight: 500;
    letter-spacing: -.5px;
    &:hover{
      transform: scale(1.01);
    }
`
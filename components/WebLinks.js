import Image from "next/image";
import styled from "styled-components";
import { Button, ButtonLink, Container, StyledLink } from "./ReusableStyles";
import Link from "next/link";
import { ChevronRightIcon, HexIcon, HomeIcon, TwitterIcon } from './icons';
import allLinks from "./LinksData";

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
              />
              <img
                src={'/realvjy.svg'}
              />
            </Title>
          </LinkHeader>
          <LinkBio>
            <h1>A Design Wizard Voyaging in the Metaverse</h1>
            <h4>Currently building what I love <a href="#">@overlayz</a></h4>
          </LinkBio>
          <WebLinkWrap>
            {
              allLinks.map((i) => {
                return (
                  <Link href={"/"} passHref key={i}>
                    <LinkBox>
                      <TwitterIcon /> website <ChevronRightIcon />
                    </LinkBox>
                  </Link>
                )
              })
            }
          </WebLinkWrap>
        </TopPart>
        <BottomPart>
          <LinkFoot>
            <h4>©realvjy ✦ vijay verma</h4>
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
`

const LinkHeader = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`

const Avatar = styled.div`
    height: 90px;
    width: 90px;
    position: relative;
`

const AvatarWrap = styled.div`
   height: 100%;
   width: 100%;
   img{
    height: calc(100% - 4px);
    width: calc(100% - 4px);
   }
   .avtar-border{
        height: 100%;
        width: 100%;
        position: absolute;
        background: var(--black);
   }
`

const Title = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`

const LinkBio = styled.div`
    display: flex;
    flex-direction: column
`

const TopPart = styled.div`
    
`

const BottomPart = styled.div`
    
`
const LinkFoot = styled.div`
    
`

const WebLinkWrap = styled.div`
    
`

const LinkBox = styled.div`
    padding: 8px 24px;
    border-radius: 10px;
    border: 1.5px solid var(--black);
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
`
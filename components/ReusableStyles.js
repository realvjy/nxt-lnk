import Link from "next/link";
import styled from "styled-components";

export const Container = styled.div`
  position: relative;
  align-items: center;
  justify-content: center;
  width: 650px;
  margin: 0 auto;
  @media screen and (max-width: ${({ theme }) => theme.deviceSize.tablet}) {
    width: 100%;
  }
`;

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;


export const Button = styled.button`
`

export const LinkButton = styled.a`
    display: flex;
    align-items: center;
    color: var(--white);
    text-decoration: none;
    color: inherit;
    cursor: pointer;
    outline: none;
    line-height: 20px;
    p{
      line-height: 24px;
      font-size: 20px;
      font-weight: 700;
      text-transform: uppercase;
      font-style: normal;
      border-top-left-radius: 16px;
      border-bottom-left-radius: 16px;
      background: var(--lfg-sky-200);
      border: 2px solid var(--lfg-sky-200);
    }
    div{
      line-height: 0;
      border-top-right-radius: 16px;
      border-bottom-right-radius: 16px;
      border: 2px solid var(--lfg-sky-200);
      background: var(--lfg-sky-300);
    }
`

export const Tag = styled.div`
    font-size: 16px;
    font-weight: 700;
    line-height: 20px;
    padding: 4px 12px;
    border-radius: 14px;
    display: inline-flex;
    border: 1px solid var(--black);
    
    &.red{
        background: var(--red);
    }
    &.blue{
        background: var(--blue);
    }
    &.yellow{
        background: var(--yellow);
    }
`

export const StyledLink = styled.a`
    line-height: normal;
    cursor: pointer;
    color: ${({ theme }) => theme.text.primary};
`

export const IssueGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 40px;
    cursor: pointer;
    @media screen and (max-width: ${({ theme }) => theme.deviceSize.tablet}) {
        grid-template-columns: repeat(1, 1fr);
        padding: 20px;
  }
`

export const ButtonLink = styled.a`
    font-size: 24px;
    display: inline-flex;
    line-height: normal;
    padding: 16px 32px;
    border-style: none;
    outline: none;
    cursor: pointer;
    border-radius: 36px;
    background: rgb(228, 232, 236);
    background: linear-gradient(262.31deg, #06F1F8 1.86%, #2F8FFF 27.73%, #FF3382 68.97%, #FFBD6F 99.88%);
    transition: all .3s;
    position: relative;
 

`
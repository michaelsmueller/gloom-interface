import React, { useContext } from 'react';
import styled from 'styled-components/macro';
import { Web3Context } from 'contexts/web3Context';

const Container = styled.nav`
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  height: 60px;
  width: 100vw;
  background: var(--gloomBlue);
`;

const Content = styled.div`
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--nearWhite);
  padding: 0 20px;
`;

const Logo = styled.img`
  width: 120px;
  @media (max-width: 768px) {
    width: 80px;
  }
`;

const Account = styled.span`
  font-size: 0.9em;
  @media (max-width: 768px) {
    letter-spacing: -1px;
    font-size: 0.7em;
  }
`;

export default function Nav() {
  const { web3Context } = useContext(Web3Context);
  const { account } = web3Context;
  return (
    <Container>
      <Content>
        <a href='/'>
          <Logo src='test.png' alt='Gloom logo' />
        </a>
        <Account>{account || <span>connect account</span>}</Account>
      </Content>
    </Container>
  );
}

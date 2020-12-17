/* eslint-disable no-console */
import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { Web3Context } from 'contexts/web3Context';
import Container from 'styles/homeStyles';
import Button from 'styles/buttonStyles';

export default function Home() {
  const history = useHistory();
  const { web3Context } = useContext(Web3Context);
  const { active, error } = web3Context;

  if (!active && !error) return <div>loading</div>;
  if (error) return <div>Error {error.message}</div>;

  const goToSeller = () => history.push('/seller');
  const goToBidder = () => history.push('/bidder');

  return (
    <Container>
      <header>
        <a href='/'>
          <img src='/gloom-logo.png' alt='Gloom logo' />
        </a>
      </header>
      <h1>Transactions outside the light of day</h1>
      <p>
        You backed the protocol and own a ton of tokens. You want to cash out but don’t want to hurt the project. Gloom
        lets you conduct a private, invite-only auction with the security of the blockchain. Exit gracefully, earn what
        you deserve.
      </p>

      <Button type='button' onClick={goToSeller}>
        Auction ERC-20 tokens
      </Button>
      <Button type='button' onClick={goToBidder}>
        Bid on auction
      </Button>
    </Container>
  );
}

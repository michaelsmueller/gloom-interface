/* eslint-disable no-console */
import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import AuctionFactory from 'contracts/AuctionFactory.json';
import { Contract } from '@ethersproject/contracts';
import { Web3Context } from 'contexts/web3Context';
import { getSigner } from 'utils/web3Library';
import Button from 'styles/buttonStyles';

export default function Home() {
  const history = useHistory();
  const { web3Context } = useContext(Web3Context);
  const { active, error, library, chainId } = web3Context;
  const [factoryContract, setFactoryContract] = useState(null);
  const [auctionAddress, setAuctionAddress] = useState('');
  const [auctionInvitedAddress, setAuctionInvitedAddress] = useState('');
  const [winner, setWinner] = useState('');

  useEffect(() => {
    if (!active) return;
    const signer = getSigner(library);
    const { address } = AuctionFactory.networks[chainId];
    const factoryInstance = new Contract(address, AuctionFactory.abi, signer);
    setFactoryContract(factoryInstance);
  }, [active, library, chainId]);

  useEffect(() => {
    if (!active || !factoryContract) return;
    const getAuction = async () => {
      const auction = await factoryContract.getAuctionBy();
      if (auction !== '0x0000000000000000000000000000000000000000') setAuctionAddress(auction);
      const auctionInvited = await factoryContract.getAuctionInvited();
      if (auctionInvited !== '0x0000000000000000000000000000000000000000') setAuctionInvitedAddress(auctionInvited);
    };
    getAuction();
  }, [active, factoryContract]);

  useEffect(() => {
    if (!active || !factoryContract) return null;
    factoryContract.on('LogBidderRegistered', auction => {
      console.log('LogBidderRegistered event, auction', auction);
      setAuctionInvitedAddress(auction);
    });
    return () => factoryContract.removeAllListeners('LogBidderRegistered');
  }, [active, factoryContract]);

  // useEffect(() => {
  //   if (!active || !auctionContract) return null;
  //   auctionContract.on('LogSetWinner', bidder => {
  //     console.log('LogSetWinner event, auction', bidder);
  //     setWinner(bidder);
  //   });
  //   return () => auctionContract.removeAllListeners('LogSetWinner');
  // }, [active, auctionContract]);

  if (!active && !error) return <div>loading</div>;
  if (error) return <div>Error {error.message}</div>;

  const goToSeller = () => history.push('seller');
  const goToBidder = () => history.push('/bidder');

  return (
    <div>
      <header>
        <a href='/'>
          <img src='/gloom-logo.png' alt='Gloom logo' />
        </a>
      </header>
      <main>
        <h1>Transactions outside the light of day</h1>
        <p>
          You backed the protocol and own a ton of tokens. You want to cash out but don’t want to hurt the project.
          Gloom lets you conduct a private, invite-only auction with the security of the blockchain. Exit gracefully,
          earn what you deserve.
        </p>
      </main>

      <Button type='button' onClick={goToSeller}>
        Auction ERC-20 tokens
      </Button>
      <Button type='button' onClick={goToBidder}>
        Bid on auction
      </Button>
    </div>
  );
}

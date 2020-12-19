/* eslint-disable no-console */
import React, { useContext, useEffect, useState } from 'react';
import useContract from 'hooks/useContract';
import { Web3Context } from 'contexts/web3Context';
import AuctionFactory from 'contracts/AuctionFactory.json';
import { BackButton, BidderPhaseSwitcher, AssetDetails, AuctionDateTimes } from 'components';

export default function BidderDashboard() {
  const { web3Context } = useContext(Web3Context);
  const { active, error } = web3Context;
  const factoryContract = useContract(AuctionFactory, web3Context);
  const [auctionAddress, setAuctionAddress] = useState('');
  // const [winner, setWinner] = useState('');

  useEffect(() => {
    if (!active || !factoryContract) return;
    const getAuctionInvited = async () => {
      const auctionInvited = await factoryContract.getAuctionInvited();
      if (auctionInvited !== '0x0000000000000000000000000000000000000000') setAuctionAddress(auctionInvited);
    };
    getAuctionInvited();
  }, [active, factoryContract]);

  useEffect(() => {
    if (!active || !factoryContract) return null;
    factoryContract.on('LogBidderRegistered', auction => {
      console.log('LogBidderRegistered event, auction', auction);
      setAuctionAddress(auction);
    });
    return () => factoryContract.removeAllListeners('LogBidderRegistered');
  }, [active, factoryContract]);

  if (!active && !error) return <div>loading</div>;
  if (error) return <div>Error {error.message}</div>;

  return (
    <div>
      <BackButton />
      <a href='/'>
        <img src='gloom-logo.png' alt='Gloom logo' />
      </a>
      <h1>Bidder dashboard</h1>
      {auctionAddress ? (
        <>
          <AssetDetails auctionAddress={auctionAddress} />
          <AuctionDateTimes auctionAddress={auctionAddress} />
          <BidderPhaseSwitcher auctionAddress={auctionAddress} />
        </>
      ) : (
        <div>You have no auction invites</div>
      )}
    </div>
  );
}

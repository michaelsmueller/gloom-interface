/* eslint-disable no-console */
import React, { useContext, useEffect, useState } from 'react';
import AuctionFactory from 'contracts/AuctionFactory.json';
import { Contract } from '@ethersproject/contracts';
import { Web3Context } from 'contexts/web3Context';
import { getSigner } from 'utils/web3Library';
import { BackButton, Bid, AssetDetails, AuctionDateTimes } from 'components';

export default function BidderDashboard() {
  const { web3Context } = useContext(Web3Context);
  const { active, error, library, chainId } = web3Context;
  const [factoryContract, setFactoryContract] = useState(null);
  const [auctionAddress, setAuctionAddress] = useState('');
  // const [winner, setWinner] = useState('');

  useEffect(() => {
    if (!active) return;
    const signer = getSigner(library);
    const { address } = AuctionFactory.networks[chainId];
    const factoryInstance = new Contract(address, AuctionFactory.abi, signer);
    setFactoryContract(factoryInstance);
  }, [active, library, chainId]);

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
          <Bid auctionAddress={auctionAddress} />
        </>
      ) : (
        <div>You have no auction invites</div>
      )}
    </div>
  );
}

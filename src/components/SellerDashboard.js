/* eslint-disable no-console */
import React, { useContext, useEffect, useState } from 'react';
import useContract from 'hooks/useContract';
import { Web3Context } from 'contexts/web3Context';
import AuctionFactory from 'contracts/AuctionFactory.json';
import { BackButton, SellerPhaseSwitcher, AssetDetails, AuctionDateTimes, StartPhases } from 'components';

export default function SellerDashboard() {
  const { web3Context } = useContext(Web3Context);
  const { active, error } = web3Context;
  const factoryContract = useContract(AuctionFactory, web3Context);
  const [auctionAddress, setAuctionAddress] = useState('');

  useEffect(() => {
    if (!active || !factoryContract) return;
    const getAuction = async () => {
      const auction = await factoryContract.getAuctionBy();
      if (auction !== '0x0000000000000000000000000000000000000000') setAuctionAddress(auction);
    };
    getAuction();
  }, [active, factoryContract]);

  useEffect(() => {
    if (!active || !factoryContract) return;
    factoryContract.on('LogAuctionCreated', auction => {
      console.log('SellerDashboard LogAuctionCreated auction', auction);
      setAuctionAddress(auction);
    });
  });

  if (!active && !error) return <div>loading</div>;
  if (error) return <div>Error {error.message}</div>;

  return (
    <div>
      <BackButton />
      <a href='/'>
        <img src='gloom-logo.png' alt='Gloom logo' />
      </a>
      <h1>Seller dashboard</h1>
      <SellerPhaseSwitcher auctionAddress={auctionAddress} />
      <AssetDetails auctionAddress={auctionAddress} />
      <AuctionDateTimes auctionAddress={auctionAddress} />
      <StartPhases auctionAddress={auctionAddress} />
    </div>
  );
}

/* eslint-disable no-console */
import React, { useContext, useEffect, useState } from 'react';
import AuctionFactory from 'contracts/AuctionFactory.json';
import { Contract } from '@ethersproject/contracts';
import { Web3Context } from 'contexts/web3Context';
import { getSigner } from 'utils/web3Library';
import { BackButton, SellerPhases, AssetDetails, AuctionDateTimes, StartPhases } from 'components';

export default function SellerDashboard() {
  const { web3Context } = useContext(Web3Context);
  const { active, error, library, chainId } = web3Context;
  const [factoryContract, setFactoryContract] = useState(null);
  const [auctionAddress, setAuctionAddress] = useState('');

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
      <SellerPhases auctionAddress={auctionAddress} />
      <AssetDetails auctionAddress={auctionAddress} />
      <AuctionDateTimes auctionAddress={auctionAddress} />
      <StartPhases auctionAddress={auctionAddress} />
    </div>
  );
}

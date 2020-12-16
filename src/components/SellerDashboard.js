/* eslint-disable no-console */
import React, { useContext, useContract, useEffect, useState } from 'react';
// import { useHistory } from 'react-router-dom';
import AuctionFactory from 'contracts/AuctionFactory.json';
import { Contract } from '@ethersproject/contracts';
import { Web3Context } from 'contexts/web3Context';
import { getSigner } from 'utils/web3Library';
import { AuctionSetup, AuctionDateTimes, StartPhases } from 'components';
// import Button from 'styles/buttonStyles';

export default function SellerDashboard() {
  // const history = useHistory();
  const { web3Context } = useContext(Web3Context);
  const { active, error, library, chainId } = web3Context;
  const [factoryContract, setFactoryContract] = useState(null);
  const [auctionAddress, setAuctionAddress] = useState('');
  // const [showing, setShowing] = useState('AUCTION_SETUP');

  useEffect(() => {
    // setup factory contract
    if (!active) return;
    const signer = getSigner(library);
    const { address } = AuctionFactory.networks[chainId];
    const factoryInstance = new Contract(address, AuctionFactory.abi, signer);
    setFactoryContract(factoryInstance);
  }, [active, library, chainId]);

  useEffect(() => {
    // get seller's existing auction, if already created
    if (!active || !factoryContract) return;
    const getAuction = async () => {
      const auction = await factoryContract.getAuctionBy();
      if (auction !== '0x0000000000000000000000000000000000000000') setAuctionAddress(auction);
    };
    getAuction();
  }, [active, factoryContract]);

  useEffect(() => {
    // watch for creation of new auction
    if (!active || !factoryContract) return;
    factoryContract.on('LogAuctionCreated', auction => {
      console.log('SellerDashboard LogAuctionCreated auction', auction);
      setAuctionAddress(auction);
    });
  });

  if (!active && !error) return <div>loading</div>;
  if (error) return <div>Error {error.message}</div>;

  // const goToTokenAndDates = () => history.push('/auctions/new');
  // const goToAuctionDetails = () => history.push(`/auctions/${auctionAddress}`);

  return (
    <div>
      <h1>Seller Dashboard</h1>
      <div>auction address: {auctionAddress}</div>
      {/* <Button type='button' onClick={goToTokenAndDates}>
        New auction
      </Button>
      {auctionAddress && (
        <div>
          <pre>{auctionAddress}</pre>
          <Button type='button' onClick={goToAuctionDetails}>
            View auction
          </Button>
        </div>
      )} */}
      <AuctionSetup auctionAddress={auctionAddress} />
      <AuctionDateTimes auctionAddress={auctionAddress} />
      <StartPhases auctionAddress={auctionAddress} />
    </div>
  );
}

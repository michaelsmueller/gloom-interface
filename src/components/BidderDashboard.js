/* eslint-disable no-console */
import React, { useContext, useEffect, useState } from 'react';
// import { useHistory } from 'react-router-dom';
import AuctionFactory from 'contracts/AuctionFactory.json';
import { Contract } from '@ethersproject/contracts';
import { Web3Context } from 'contexts/web3Context';
import { getSigner } from 'utils/web3Library';
import { Bid } from 'components';
import Button from 'styles/buttonStyles';

export default function BidderDashboard() {
  // const history = useHistory();
  const { web3Context } = useContext(Web3Context);
  const { active, error, library, chainId } = web3Context;
  const [factoryContract, setFactoryContract] = useState(null);
  const [auctionAddress, setAuctionAddress] = useState('');
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

  // const goToCommitBid = () => history.push(`/auctions/${auctionAddress}/commit-bid`);
  // const goToRevealBid = () => history.push(`/auctions/${auctionAddress}/reveal-bid`);
  // const goToPay = () => history.push(`/auctions/${auctionAddress}/reveal-bid`);

  return (
    <div>
      <h1>Bidder Dashboard</h1>
      <h2>Invited to bid</h2>
      <div>auction address: {auctionAddress}</div>
      {/* {auctionAddress ? (
        <div>
          <pre>{auctionAddress}</pre>
          <Button type='button' onClick={goToCommitBid}>
            Commit bid
          </Button>
          <pre>{auctionAddress}</pre>
          <Button type='button' onClick={goToRevealBid}>
            Reveal bid
          </Button>
          {!winner ? (
            <Button type='button' onClick={goToPay}>
              Pay
            </Button>
          ) : null}
        </div>
      ) : (
        <pre>none</pre>
      )} */}
      <Bid auctionAddress={auctionAddress} />
      {/* <CommitBid auctionAddress={auctionAddress} />
      <RevealBid auctionAddress={auctionAddress} /> */}
    </div>
  );
}

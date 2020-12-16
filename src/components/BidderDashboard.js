/* eslint-disable no-console */
import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import AuctionFactory from 'contracts/AuctionFactory.json';
import { Contract } from '@ethersproject/contracts';
import { Web3Context } from 'contexts/web3Context';
import { getSigner } from 'utils/web3Library';
import Button from 'styles/buttonStyles';

export default function BidderDashboard() {
  const history = useHistory();
  const { web3Context } = useContext(Web3Context);
  const { active, error, library, chainId } = web3Context;
  const [factoryContract, setFactoryContract] = useState(null);
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
    const getAuctionInvited = async () => {
      const auctionInvited = await factoryContract.getAuctionInvited();
      if (auctionInvited !== '0x0000000000000000000000000000000000000000') setAuctionInvitedAddress(auctionInvited);
    };
    getAuctionInvited();
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

  const goToCommitBid = () => history.push(`/auctions/${auctionInvitedAddress}/commit-bid`);
  const goToRevealBid = () => history.push(`/auctions/${auctionInvitedAddress}/reveal-bid`);
  const goToPay = () => history.push(`/auctions/${auctionInvitedAddress}/reveal-bid`);

  return (
    <div>
      <h2>Invited to bid</h2>
      {auctionInvitedAddress ? (
        <div>
          <pre>{auctionInvitedAddress}</pre>
          <Button type='button' onClick={goToCommitBid}>
            Commit bid
          </Button>
          <pre>{auctionInvitedAddress}</pre>
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
      )}
    </div>
  );
}

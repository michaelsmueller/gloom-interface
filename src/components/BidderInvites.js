/* eslint-disable no-console */
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Contract } from '@ethersproject/contracts';
import { Web3Context } from '../contexts/web3Context';
import Auction from '../contracts/Auction.json';
import { BidderInvitesForm } from '.';
import { getSigner } from '../utils/web3Library';

export default function BidderInvites() {
  const { id: auctionAddress } = useParams();
  const { web3Context } = useContext(Web3Context);
  const { account, active, error, library } = web3Context;
  const [auctionContract, setAuctionContract] = useState(null);

  useEffect(() => {
    if (!active) return;
    const signer = getSigner(library);
    const auctionInstance = new Contract(auctionAddress, Auction.abi, signer);
    setAuctionContract(auctionInstance);
  }, [active, library, auctionAddress]);

  if (!active && !error) return <div>loading</div>;
  if (error) return <div>error</div>;

  const inviteBidders = async ({ bidderDeposit, bidders }) => {
    console.log('bidderDeposit', bidderDeposit);
    console.log('bidders', bidders);
    const bidderAddresses = bidders.map(bidder => bidder.account);
    console.log('bidderAddresses', bidderAddresses);
    // const overrides = { from: account };
    const tx = await auctionContract.setupBidders(bidderDeposit, bidderAddresses);
    const receipt = await tx.wait();
    console.log('tx', tx);
    console.log('receipt', receipt);
  };

  return (
    <div>
      <h1>Bidder invites</h1>
      <BidderInvitesForm onSubmit={inviteBidders} />
      <pre>Auction contract: {auctionAddress}</pre>
    </div>
  );
}

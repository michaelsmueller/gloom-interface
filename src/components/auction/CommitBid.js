/* eslint-disable no-console */
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Contract } from '@ethersproject/contracts';
import { formatUnits } from '@ethersproject/units';
import { keccak256 } from '@ethersproject/keccak256';
import { toUtf8Bytes } from '@ethersproject/strings';
import { Web3Context } from 'contexts/web3Context';
import Auction from 'contracts/Auction.json';
import { BackButton, CommitBidForm } from 'components';
import { getSigner } from 'utils/web3Library';

export default function Bid() {
  const { id: auctionAddress } = useParams();
  const { web3Context } = useContext(Web3Context);
  const { active, error, library } = web3Context;
  const [auctionContract, setAuctionContract] = useState(null);
  const [bidderDeposit, setBidderDeposit] = useState(null);

  useEffect(() => {
    if (!active) return;
    const signer = getSigner(library);
    const auctionInstance = new Contract(auctionAddress, Auction.abi, signer);
    setAuctionContract(auctionInstance);
  }, [active, library, auctionAddress]);

  useEffect(() => {
    console.log('useEffect 2');
    if (!active || !auctionContract) return;
    console.log('active');
    const getBidderDeposit = async () => {
      console.log('getBidderDeposit');
      const temp = await auctionContract.getBidderDeposit();
      setBidderDeposit(temp);
    };
    getBidderDeposit();
  }, [active, auctionContract]);

  if (!active && !error) return <div>loading</div>;
  if (error) return <div>error</div>;

  const submitBid = async ({ bid }) => {
    console.log('bid', bid);
    const randomBytes = toUtf8Bytes(`${Math.random()}`);
    const salt = keccak256(randomBytes);
    console.log('salt', salt);
    // const overrides = { from: account };
    // const tx = await auctionContract.setupBidders(bidderDeposit, bidderAddresses);
    // const receipt = await tx.wait();
    // console.log('tx', tx);
    // console.log('receipt', receipt);
    // auctionContract.on('InvitedBidder', bidder => {
    //   console.log('InvitedBidder event, bidder', bidder);
    // });
  };

  return (
    <div>
      <BackButton />
      <h1>Submit bid</h1>
      <CommitBidForm bidderDeposit={bidderDeposit ? formatUnits(bidderDeposit) : ''} onSubmit={submitBid} />
      <pre>
        Auction contract: {auctionAddress}
        <br />
        {JSON.stringify(auctionContract, null, 2)}
      </pre>
    </div>
  );
}

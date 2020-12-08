/* eslint-disable no-console */
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Contract } from '@ethersproject/contracts';
import { formatUnits } from '@ethersproject/units';
import { formatBytes32String } from '@ethersproject/strings';
import { Web3Context } from 'contexts/web3Context';
import Auction from 'contracts/Auction.json';
import { BackButton, CommitBidForm } from 'components';
import { getSigner } from 'utils/web3Library';

export default function CommitBid() {
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
      const deposit = await auctionContract.getBidderDeposit();
      setBidderDeposit(deposit);
    };
    getBidderDeposit();
  }, [active, auctionContract]);

  if (!active && !error) return <div>loading</div>;
  if (error) return <div>error</div>;

  const submitBid = async ({ bid, password }) => {
    const bidHex = formatBytes32String(bid);
    const salt = formatBytes32String(password);
    const hashedBid = await auctionContract.getSaltedHash(bidHex, salt);

    console.log('bid', bid);
    console.log('password', password);
    console.log('salt', salt);
    console.log('hashedBid', hashedBid);

    const tx = await auctionContract.commitBid(hashedBid);
    const receipt = await tx.wait();
    console.log('tx', tx);
    console.log('receipt', receipt);
    auctionContract.on('LogBidCommitted', (bidder, bidHash, bidCommitBlock) => {
      console.log('bidder', bidder);
      console.log('bidHash', bidHash);
      console.log('bidCommitBlock', bidCommitBlock);
    });
  };

  return (
    <div>
      <BackButton />
      <h1>Commit bid</h1>
      <CommitBidForm bidderDeposit={bidderDeposit ? formatUnits(bidderDeposit) : ''} onSubmit={submitBid} />
      <pre>
        Auction contract: {auctionAddress}
        <br />
        {JSON.stringify(auctionContract, null, 2)}
      </pre>
    </div>
  );
}

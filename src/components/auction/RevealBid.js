/* eslint-disable no-console */
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Contract } from '@ethersproject/contracts';
import { formatUnits, parseEther } from '@ethersproject/units';
import { formatBytes32String } from '@ethersproject/strings';
import { hexZeroPad } from '@ethersproject/bytes';
import { Web3Context } from 'contexts/web3Context';
import { getSigner } from 'utils/web3Library';
import Auction from 'contracts/Auction.json';
import { BackButton, RevealBidForm } from 'components';

export default function RevealBid() {
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

  const revealBid = async ({ bid, password }) => {
    const bidHex = hexZeroPad(parseEther(bid), 32);
    console.log('bidHex', bidHex);
    const salt = formatBytes32String(password);
    const tx = await auctionContract.revealBid(bidHex, salt);
    const receipt = await tx.wait();
    console.log('tx', tx);
    console.log('receipt', receipt);
    auctionContract.on('LogBidRevealed', (bidder, bidHexReturned, saltReturned) => {
      console.log('event LogBidRevealed emitted');
      console.log('bidder', bidder);
      console.log('bidHex', bidHexReturned);
      console.log('salt', saltReturned);
    });
  };

  return (
    <div>
      <BackButton />
      <h1>Reveal bid</h1>
      <RevealBidForm bidderDeposit={bidderDeposit ? formatUnits(bidderDeposit) : ''} onSubmit={revealBid} />
      <pre>
        Auction contract: {auctionAddress}
        <br />
        {JSON.stringify(auctionContract, null, 2)}
      </pre>
    </div>
  );
}

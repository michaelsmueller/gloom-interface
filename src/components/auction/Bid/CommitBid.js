/* eslint-disable no-console */
import React, { useContext, useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
import { Contract } from '@ethersproject/contracts';
import { formatUnits, parseEther } from '@ethersproject/units';
import { formatBytes32String } from '@ethersproject/strings';
import { hexZeroPad } from '@ethersproject/bytes';
import { Web3Context } from 'contexts/web3Context';
import { getSigner } from 'utils/web3Library';
import Auction from 'contracts/Auction.json';
import { BackButton, CommitBidForm } from 'components';

export default function CommitBid({ auctionAddress }) {
  // const { id: auctionAddress } = useParams();
  const { web3Context } = useContext(Web3Context);
  const { account, active, error, library } = web3Context;
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
    const bidHex = hexZeroPad(parseEther(bid), 32);
    console.log('bidHex', bidHex);
    const salt = formatBytes32String(password);
    const hashedBid = await auctionContract.getSaltedHash(bidHex, salt);
    const overrides = { from: account, value: parseEther(formatUnits(bidderDeposit)) };
    const tx = await auctionContract.submitBid(hashedBid, overrides);
    const receipt = await tx.wait();
    console.log('tx', tx);
    console.log('receipt', receipt);

    auctionContract.on('LogBidderDepositReceived', (bidder, deposit) => {
      console.log('ReceivedBidderDeposit event, bidder', bidder);
      console.log('ReceivedBidderDeposit event, bidderDeposit', formatUnits(deposit));
    });

    auctionContract.on('LogBidCommitted', (bidder, bidHash, bidCommitBlock) => {
      console.log('LogBidCommitted event bidder', bidder);
      console.log('LogBidCommitted event bidHash', bidHash);
      console.log('LogBidCommitted event bidCommitBlock', bidCommitBlock);
    });
  };

  return (
    <div>
      {/* <BackButton /> */}
      <h1>Commit bid</h1>
      <div>
        <em>
          We will commit a hash of your bid to the blockchain, to register the amount confidentially. You will need to
          enter your bid and password again at auction close to reveal your bid. We will not store your bid and
          password, nor can they be recovered.
        </em>
      </div>
      <CommitBidForm bidderDeposit={bidderDeposit ? formatUnits(bidderDeposit) : ''} onSubmit={submitBid} />
    </div>
  );
}

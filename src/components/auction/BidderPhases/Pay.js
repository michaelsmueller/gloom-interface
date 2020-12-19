/* eslint-disable no-console */
import React, { useContext, useEffect, useState } from 'react';
import { Contract } from '@ethersproject/contracts';
import { formatUnits, parseEther } from '@ethersproject/units';
import { formatBytes32String } from '@ethersproject/strings';
import { hexZeroPad } from '@ethersproject/bytes';
import { Web3Context } from 'contexts/web3Context';
import { getSigner } from 'utils/web3Library';
import Auction from 'contracts/Auction.json';
import Escrow from 'contracts/Escrow.json';
import { PayForm } from 'components';

export default function Pay({ auctionAddress }) {
  const { web3Context } = useContext(Web3Context);
  const { active, error, library } = web3Context;
  const [auctionContract, setAuctionContract] = useState(null);
  const [escrowContract, setEscrowContract] = useState(null);
  const [winningBid, setWinningBid] = useState(null);

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
      // setBidderDeposit(deposit);
    };
    getBidderDeposit();
  }, [active, auctionContract]);

  if (!active && !error) return <div>loading</div>;
  if (error) return <div>error</div>;

  const pay = async () => {
    console.log('pay');
  };

  return (
    <div>
      <h2>Pay</h2>
      <PayForm winningBid={winningBid ? formatUnits(winningBid) : ''} onSubmit={pay} />
    </div>
  );
}

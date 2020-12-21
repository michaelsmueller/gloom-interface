import React from 'react';
import { useContractAt } from 'hooks';
import Auction from 'contracts/Auction.json';
import { Button } from 'styles/buttonStyles';

export default function StartPhases({ auctionAddress }) {
  const auctionContract = useContractAt(Auction, auctionAddress);

  const startCommit = () => auctionContract.startCommit();
  const startReveal = () => auctionContract.startReveal();
  const startDeliver = () => auctionContract.startDeliver();
  const startWithdraw = () => auctionContract.startWithdraw();

  return (
    <div>
      <Button type='button' onClick={startCommit}>
        Commit
      </Button>
      <Button type='button' onClick={startReveal}>
        Reveal
      </Button>
      <Button type='button' onClick={startDeliver}>
        Deliver
      </Button>
      <Button type='button' onClick={startWithdraw}>
        Withdraw
      </Button>
    </div>
  );
}

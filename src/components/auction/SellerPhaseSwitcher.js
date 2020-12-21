import React, { useContext, useEffect, useState } from 'react';
import { useContractAt, useWinner } from 'hooks';
import { Web3Context } from 'contexts/web3Context';
import Auction from 'contracts/Auction.json';
import { formatEther } from '@ethersproject/units';
import { SellerNav, TokenAndDates, SellerDeposit, BidderInvites, Transfer, SellerWithdraw } from 'components';
import { toast } from 'react-toastify';

export default function SellerPhaseSwitcher({ auctionAddress }) {
  const { web3Context } = useContext(Web3Context);
  const { active } = web3Context;
  const auctionContract = useContractAt(Auction, auctionAddress);
  const { setWinningBid, winningBidder, setWinningBidder } = useWinner(auctionContract);
  const [showing, setShowing] = useState('TOKEN_AND_DATES');

  useEffect(() => {
    if (!active || !auctionContract) return null;
    auctionContract.once('LogSetWinner', (bidder, bid) => {
      toast.success(`${bidder} won the auction with a bid of ${formatEther(bid)}`);
      setWinningBidder(bidder);
      setWinningBid(bid);
    });
    return () => auctionContract.removeAllListeners('LogSetWinner');
  });

  return (
    <div>
      <h2>Auction</h2>
      <SellerNav showing={showing} setShowing={setShowing} auctionAddress={auctionAddress} isWinner={winningBidder} />
      {showing === 'TOKEN_AND_DATES' && <TokenAndDates />}
      {showing === 'SELLER_DEPOSIT' && <SellerDeposit auctionAddress={auctionAddress} />}
      {showing === 'BIDDER_INVITES' && <BidderInvites auctionAddress={auctionAddress} />}
      {showing === 'TRANSFER' && <Transfer auctionAddress={auctionAddress} />}
      {showing === 'WITHDRAW' && <SellerWithdraw auctionAddress={auctionAddress} />}
    </div>
  );
}
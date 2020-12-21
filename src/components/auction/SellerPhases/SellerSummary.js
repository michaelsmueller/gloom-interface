import React from 'react';
import { useContractAt, useAsset, useSellerDeposit, useWinner, useBidderDeposit, useBidders } from 'hooks';
import Auction from 'contracts/Auction.json';
import { formatUnits, formatEther } from '@ethersproject/units';
import { DECIMALS } from 'data/constants';
import { StartPhases, SellerSummaryForm } from 'components';

export default function SellerSummary({ auctionAddress }) {
  const auctionContract = useContractAt(Auction, auctionAddress);
  const { tokenAmount, tokenContract } = useAsset(auctionContract);
  const { sellerDeposit } = useSellerDeposit(auctionContract);
  const { winningBid, winningBidder } = useWinner(auctionContract);
  const { bidderDeposit } = useBidderDeposit(auctionContract);
  const { bidders } = useBidders(auctionContract);

  const data = {
    tokenAmount: tokenAmount ? formatUnits(tokenAmount, DECIMALS) : '',
    tokenContract,
    sellerDeposit: sellerDeposit ? formatEther(sellerDeposit) : '',
    winningBid: winningBid ? formatEther(winningBid) : '',
    winningBidder,
    bidderDeposit: bidderDeposit ? formatEther(bidderDeposit) : '',
    bidders,
  };

  return (
    <>
      <StartPhases auctionAddress={auctionAddress} />
      <SellerSummaryForm data={data} />
    </>
  );
}

import React, { useContext } from 'react';
import { useContractAt, useBidderDeposit } from 'hooks';
import { Web3Context } from 'contexts/web3Context';
import { LoadingContext } from 'contexts/loadingContext';
import Auction from 'contracts/Auction.json';
import { formatEther, parseEther } from '@ethersproject/units';
import { BidderWithdrawForm } from 'components';
import { toast } from 'react-toastify';

export default function BidderWithdraw({ auctionAddress }) {
  // const { web3Context } = useContext(Web3Context);
  const auctionContract = useContractAt(Auction, auctionAddress);
  const { setIsLoading } = useContext(LoadingContext);
  const { bidderDeposit } = useBidderDeposit(auctionContract);

  const withdrawDeposit = async () => {
    setIsLoading(true);
    try {
      await auctionContract.withdrawBidderDeposit();
      toast.info('Withdrawing deposit');
      auctionContract.once('error', error =>
        toast.error(`Error withdrawing deposit: ${error.data?.message || error.message}`),
      );
      auctionContract.once('LogBidderDepositWithdrawn', (bidder, deposit) =>
        toast.success(`${formatEther(deposit)} ETH withdrawel completed by ${bidder}`),
      );
    } catch (error) {
      toast.error(`Error: ${error.data?.message || error.message}`);
    }
    setIsLoading(false);
  };

  return (
    <BidderWithdrawForm bidderDeposit={bidderDeposit ? formatEther(bidderDeposit) : ''} onSubmit={withdrawDeposit} />
  );
}

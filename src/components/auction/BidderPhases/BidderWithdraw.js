import React, { useContext } from 'react';
import { useContractAt, useEscrowAddress, useBidderDeposit } from 'hooks';
// import { Web3Context } from 'contexts/web3Context';
import { LoadingContext } from 'contexts/loadingContext';
import Auction from 'contracts/Auction.json';
import Escrow from 'contracts/Escrow.json';
import { formatEther, parseEther } from '@ethersproject/units';
import { BidderWithdrawForm } from 'components';
import { toast } from 'react-toastify';

export default function BidderWithdraw({ auctionAddress }) {
  // const { web3Context } = useContext(Web3Context);
  const auctionContract = useContractAt(Auction, auctionAddress);
  const { escrowAddress } = useEscrowAddress(auctionContract);
  const escrowContract = useContractAt(Escrow, escrowAddress);
  const { bidderDeposit } = useBidderDeposit(auctionContract);
  const { setIsLoading } = useContext(LoadingContext);

  const withdrawDeposit = async () => {
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
  };

  const withdrawTokens = async () => {
    // try {
    //   await escrowContract.sellerWithdraw();
    //   toast.info('Withdrawing payment');
    //   auctionContract.once('error', error =>
    //     toast.error(`Error withdrawing payment: ${error.data?.message || error.message}`),
    //   );
    //   escrowContract.once('LogSellerWithdrew', (seller, amount) =>
    //     toast.success(`${formatEther(amount)} ETH payment withdrawel completed by ${seller}`),
    //   );
    // } catch (error) {
    //   toast.error(`Error: ${error.data?.message || error.message}`);
    // }
  };

  const withdraw = async () => {
    setIsLoading(true);
    await withdrawDeposit();
    await withdrawTokens();
    setIsLoading(false);
  };

  return <BidderWithdrawForm bidderDeposit={bidderDeposit ? formatEther(bidderDeposit) : ''} onSubmit={withdraw} />;
}

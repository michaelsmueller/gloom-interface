import React, { useContext } from 'react';
import { useContractAt, useSellerDeposit } from 'hooks';
import { Web3Context } from 'contexts/web3Context';
import { LoadingContext } from 'contexts/loadingContext';
import Auction from 'contracts/Auction.json';
import { formatEther, parseEther } from '@ethersproject/units';
import { SellerWithdrawForm } from 'components';
import { toast } from 'react-toastify';

export default function SellerWithdraw({ auctionAddress }) {
  // const { web3Context } = useContext(Web3Context);
  const auctionContract = useContractAt(Auction, auctionAddress);
  const { setIsLoading } = useContext(LoadingContext);
  const { sellerDeposit } = useSellerDeposit(auctionContract);

  const withdrawDeposit = async () => {
    setIsLoading(true);
    try {
      await auctionContract.withdrawSellerDeposit();
      toast.info('Withdrawing deposit');
      auctionContract.once('error', error =>
        toast.error(`Error withdrawing deposit: ${error.data?.message || error.message}`),
      );
      auctionContract.once('LogSellerDepositWithdrawn', (seller, deposit) =>
        toast.success(`${formatEther(deposit)} ETH withdrawel completed by ${seller}`),
      );
    } catch (error) {
      toast.error(`Error: ${error.data?.message || error.message}`);
    }
    setIsLoading(false);
  };

  return (
    <SellerWithdrawForm sellerDeposit={sellerDeposit ? formatEther(sellerDeposit) : ''} onSubmit={withdrawDeposit} />
  );
}

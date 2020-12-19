/* eslint-disable no-console */
import React, { useContext } from 'react';
import useContract from 'hooks/useContract';
import { Web3Context } from 'contexts/web3Context';
import { LoadingContext } from 'contexts/loadingContext';
import Auction from 'contracts/Auction.json';
import { parseEther } from '@ethersproject/units';
import { BidderInvitesForm } from 'components';
import { toast } from 'react-toastify';

export default function BidderInvites({ auctionAddress }) {
  const { web3Context } = useContext(Web3Context);
  // const { active, error, library } = web3Context;
  const auctionContract = useContract(Auction, web3Context, auctionAddress);
  const { setIsLoading } = useContext(LoadingContext);

  // if (!active && !error) return <div>loading</div>;
  // if (error) return <div>error</div>;

  const inviteBidders = async ({ bidderDeposit, bidders }) => {
    setIsLoading(true);
    try {
      const bidderAddresses = bidders.map(bidder => bidder.account);
      await auctionContract.setupBidders(parseEther(bidderDeposit), bidderAddresses);
      toast.info('Inviting bidders');
      auctionContract.once('error', error =>
        toast.error(`Error inviting bidders: ${error.data?.message || error.message}`),
      );
      auctionContract.on('LogBidderInvited', bidder => toast.success(`Bidder ${bidder} invited`));
    } catch (error) {
      toast.error(`Error: ${error.data?.message || error.message}`);
    }
    setIsLoading(false);
  };

  return <BidderInvitesForm onSubmit={inviteBidders} />;
}

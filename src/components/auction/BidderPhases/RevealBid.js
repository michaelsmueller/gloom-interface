/* eslint-disable no-console */
import React, { useContext } from 'react';
import useContract from 'hooks/useContract';
import { Web3Context } from 'contexts/web3Context';
import { LoadingContext } from 'contexts/loadingContext';
import Auction from 'contracts/Auction.json';
import { parseEther } from '@ethersproject/units';
import { formatBytes32String } from '@ethersproject/strings';
import { hexZeroPad } from '@ethersproject/bytes';
import { RevealBidForm } from 'components';
import { toast } from 'react-toastify';

export default function RevealBid({ auctionAddress }) {
  const { web3Context } = useContext(Web3Context);
  // const { active, error } = web3Context;
  const auctionContract = useContract(Auction, web3Context, auctionAddress);
  const { setIsLoading } = useContext(LoadingContext);

  // if (!active && !error) return <div>loading</div>;
  // if (error) return <div>error</div>;

  const revealBid = async ({ bid, password }) => {
    setIsLoading(true);
    try {
      const bidHex = hexZeroPad(parseEther(bid), 32);
      const salt = formatBytes32String(password);
      await auctionContract.revealBid(bidHex, salt);
      toast.info('Revealing bid');
      auctionContract.once('error', error =>
        toast.error(`Error revealing bid: ${error.data?.message || error.message}`),
      );
      auctionContract.once('LogBidRevealed', (bidder, bidHexReturned) =>
        toast.success(`Hashed bid ${bidHexReturned} revealed from ${bidder}`),
      );
    } catch (error) {
      toast.error(`Error: ${error.data?.message || error.message}`);
    }
    setIsLoading(false);
  };

  return <RevealBidForm onSubmit={revealBid} />;
}

/* eslint-disable no-console */
import React, { useContext, useEffect, useState } from 'react';
import useContract from 'hooks/useContract';
import { Web3Context } from 'contexts/web3Context';
import { LoadingContext } from 'contexts/loadingContext';
import Auction from 'contracts/Auction.json';
import { formatUnits, parseEther } from '@ethersproject/units';
import { formatBytes32String } from '@ethersproject/strings';
import { hexZeroPad } from '@ethersproject/bytes';
import { CommitBidForm } from 'components';
import { toast } from 'react-toastify';

export default function CommitBid({ auctionAddress }) {
  const { web3Context } = useContext(Web3Context);
  const { account, active } = web3Context;
  const auctionContract = useContract(Auction, web3Context, auctionAddress);
  const [bidderDeposit, setBidderDeposit] = useState(null);
  const { setIsLoading } = useContext(LoadingContext);

  useEffect(() => {
    if (!active || !auctionContract) return;
    const getBidderDeposit = async () => {
      const deposit = await auctionContract.getBidderDeposit();
      setBidderDeposit(deposit);
    };
    getBidderDeposit();
  }, [active, auctionContract]);

  // if (!active && !error) return <div>loading</div>;
  // if (error) return <div>error</div>;

  const submitBid = async ({ bid, password }) => {
    setIsLoading(true);
    try {
      const bidHex = hexZeroPad(parseEther(bid), 32);
      const salt = formatBytes32String(password);
      const hashedBid = await auctionContract.getSaltedHash(bidHex, salt);
      await auctionContract.submitBid(hashedBid, { from: account, value: parseEther(formatUnits(bidderDeposit)) });

      toast.info('Committing bid');
      auctionContract.once('error', error =>
        toast.error(`Error committing bid: ${error.data?.message || error.message}`),
      );
      auctionContract.once('LogBidderDepositReceived', (bidder, deposit) =>
        toast.success(`${formatUnits(deposit)} ETH deposit received from ${bidder}`),
      );
      auctionContract.once('LogBidCommitted', (bidder, bidHash, bidCommitBlock) =>
        toast.success(`Hashed bid ${bidHash} commited from ${bidder} at block ${bidCommitBlock}`),
      );
    } catch (error) {
      toast.error(`Error: ${error.data?.message || error.message}`);
    }
    setIsLoading(false);
  };

  return <CommitBidForm bidderDeposit={bidderDeposit ? formatUnits(bidderDeposit) : ''} onSubmit={submitBid} />;
}

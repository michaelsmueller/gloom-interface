import React, { useContext } from 'react';
import { useContractAt, usePhase } from 'hooks';
import { LoadingContext } from 'contexts/loadingContext';
import Auction from 'contracts/Auction.json';
import { Button } from 'styles/buttonStyles';
import { toast } from 'react-toastify';

// winningBidder prop causes component to rerender on win
// eslint-disable-next-line no-unused-vars
export default function StartPhases({ auctionAddress, winningBidder }) {
  const auctionContract = useContractAt(Auction, auctionAddress);
  const { phase, setPhase } = usePhase(auctionContract);
  const { setIsLoading } = useContext(LoadingContext);

  const changePhase = async callback => {
    setIsLoading(true);
    try {
      await callback();
      toast.info('Changing phase');
      auctionContract.once('error', error =>
        toast.error(`Error changing phase: ${error.data?.message || error.message}`),
      );
      auctionContract.once('LogPhaseChangeTo', newPhase => {
        toast.success(`Phase is now ${newPhase}`);
        setPhase(newPhase);
      });
    } catch (error) {
      toast.error(`Error: ${error.data?.message || error.message}`);
    }
    setIsLoading(false);
  };

  const startCommit = () => {
    if (auctionContract) changePhase(auctionContract.startCommit);
  };

  const startReveal = () => {
    if (auctionContract) changePhase(auctionContract.startReveal);
  };

  const startDeliver = () => {
    if (auctionContract) changePhase(auctionContract.startDeliver);
  };

  const startWithdraw = () => {
    if (auctionContract) changePhase(auctionContract.startWithdraw);
  };

  return (
    <div>
      <Button active={phase === 'Setup' || !phase} type='button'>
        Setup
      </Button>
      <Button type='button' active={phase === 'Commit'} onClick={startCommit}>
        Commit
      </Button>
      <Button type='button' active={phase === 'Reveal'} onClick={startReveal}>
        Reveal
      </Button>
      <Button type='button' active={phase === 'Deliver'} onClick={startDeliver}>
        Deliver
      </Button>
      <Button type='button' active={phase === 'Withdraw'} onClick={startWithdraw}>
        Withdraw
      </Button>
    </div>
  );
}

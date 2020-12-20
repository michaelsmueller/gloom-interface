import React, { useContext, useEffect, useState } from 'react';
import useContractAt from 'hooks/useContractAt';
import { Web3Context } from 'contexts/web3Context';
import { LoadingContext } from 'contexts/loadingContext';
import Escrow from 'contracts/Escrow.json';
import { formatEther } from '@ethersproject/units';
import { PayForm } from 'components';
import { toast } from 'react-toastify';

export default function Pay({ escrowAddress }) {
  const { web3Context } = useContext(Web3Context);
  const { account, active } = web3Context;
  const escrowContract = useContractAt(Escrow, escrowAddress);
  const [winningBid, setWinningBid] = useState(null);
  const { setIsLoading } = useContext(LoadingContext);

  useEffect(() => {
    if (!active || !escrowContract) return;
    const getWinningBid = async () => {
      const bid = await escrowContract.getWinningBid();
      setWinningBid(bid);
    };
    getWinningBid();
  }, [active, escrowContract]);

  const pay = async () => {
    setIsLoading(true);
    try {
      await escrowContract.buyerPayment({ from: account, value: winningBid });
      toast.info('Sending payment');
      escrowContract.once('error', error =>
        toast.error(`Error making payment: ${error.data?.message || error.message}`),
      );
      escrowContract.once('LogBuyerPaid', (buyer, amount) =>
        toast.success(`${formatEther(amount)} ETH payment completed by ${buyer}`),
      );
    } catch (error) {
      toast.error(`Error: ${error.data?.message || error.message}`);
    }
    setIsLoading(false);
  };

  return <PayForm winningBid={winningBid ? formatEther(winningBid) : ''} onSubmit={pay} />;
}

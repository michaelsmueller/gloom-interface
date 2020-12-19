import React, { useContext, useEffect, useState } from 'react';
import useContract from 'hooks/useContract';
import { Web3Context } from 'contexts/web3Context';
import { LoadingContext } from 'contexts/loadingContext';
import Escrow from 'contracts/Escrow.json';
import { formatUnits } from '@ethersproject/units';
import { PayForm } from 'components';
import { toast } from 'react-toastify';

export default function Pay({ escrowAddress }) {
  const { web3Context } = useContext(Web3Context);
  const { account, active } = web3Context;
  const escrowContract = useContract(Escrow, web3Context, escrowAddress);
  const [winningBid, setWinningBid] = useState(null);
  const { setIsLoading } = useContext(LoadingContext);

  useEffect(() => {
    if (!active || !escrowContract) return;
    const getWinningBid = async () => {
      const winning = await escrowContract.getWinningBid();
      setWinningBid(winning);
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
        toast.success(`${formatUnits(amount)} ETH payment completed by ${buyer}`),
      );
    } catch (error) {
      toast.error(`Error: ${error.data?.message || error.message}`);
    }
    setIsLoading(false);
  };

  console.log('escrowAddress', escrowAddress);
  return <PayForm winningBid={winningBid ? formatUnits(winningBid) : ''} onSubmit={pay} />;
}

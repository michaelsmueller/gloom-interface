import React, { useContext, useEffect, useState } from 'react';
import useContractAt from 'hooks/useContractAt';
import { Web3Context } from 'contexts/web3Context';
import { LoadingContext } from 'contexts/loadingContext';
import Escrow from 'contracts/Escrow.json';
import { formatUnits } from '@ethersproject/units';
import { TransferForm } from 'components';
import { toast } from 'react-toastify';

export default function Transfer({ escrowAddress }) {
  const { web3Context } = useContext(Web3Context);
  const { account, active } = web3Context;
  const escrowContract = useContractAt(Escrow, escrowAddress);
  const [tokenAmount, setTokenAmount] = useState(null);
  const { setIsLoading } = useContext(LoadingContext);

  useEffect(() => {
    if (!active || !escrowContract) return;
    const getWinningBid = async () => {
      const amount = await escrowContract.getTokenAmount();
      setTokenAmount(amount);
    };
    getWinningBid();
  }, [active, escrowContract]);

  const transfer = async () => {
    setIsLoading(true);
    // try {
    //   await escrowContract.buyerPayment({ from: account, value: tokenAmount });
    //   toast.info('Sending payment');
    //   escrowContract.once('error', error =>
    //     toast.error(`Error making payment: ${error.data?.message || error.message}`),
    //   );
    //   escrowContract.once('LogBuyerPaid', (buyer, amount) =>
    //     toast.success(`${formatUnits(amount)} ETH payment completed by ${buyer}`),
    //   );
    // } catch (error) {
    //   toast.error(`Error: ${error.data?.message || error.message}`);
    // }
    setIsLoading(false);
  };

  console.log('escrowAddress', escrowAddress);
  return <TransferForm tokenAmount={tokenAmount ? formatUnits(tokenAmount) : ''} onSubmit={transfer} />;
}

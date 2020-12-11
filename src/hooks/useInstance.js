import { useState, useEffect } from 'react';
import { Contract } from '@ethersproject/contracts';
import { getSigner } from 'utils/web3Library';

export default function useInstance(contract, web3Context) {
  const { active, library, chainId } = web3Context;
  const [instance, setInstance] = useState(null);

  useEffect(() => {
    if (!active) return;
    const signer = getSigner(library);
    const { address } = contract.networks[chainId];
    const newInstance = new Contract(address, contract.abi, signer);
    setInstance(newInstance);
  }, [contract, active, library, chainId]);

  return instance;
}

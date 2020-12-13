import { useState, useEffect } from 'react';
import { Contract } from '@ethersproject/contracts';
import { getSigner } from 'utils/web3Library';

export default function useContract(contract, web3Context, deployedAddress = null) {
  const { active, library, chainId } = web3Context;
  const [instance, setInstance] = useState(null);

  let address;
  if (deployedAddress) address = deployedAddress;
  else address = contract.networks[chainId]?.address;

  useEffect(() => {
    if (!active) return;
    const signer = getSigner(library);
    const newInstance = new Contract(address, contract.abi, signer);
    setInstance(newInstance);
  }, [contract, active, address, library, chainId]);

  return instance;
}

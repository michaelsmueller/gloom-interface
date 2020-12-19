import { useContext, useState, useEffect } from 'react';
import { Contract } from '@ethersproject/contracts';
import { Web3Context } from 'contexts/web3Context';
import { getSigner } from 'utils/web3Library';

export default function useContract(contract, deployedAddress = null) {
  const { web3Context } = useContext(Web3Context);
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

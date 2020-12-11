import React, { useContext } from 'react';
import { Web3Context } from 'contexts/web3Context';

export default function Network() {
  const { web3Context } = useContext(Web3Context);
  const { account, chainId } = web3Context;

  return (
    <pre>
      <li>Chain id: {chainId}</li>
      <li>Active account: {account}</li>
    </pre>
  );
}

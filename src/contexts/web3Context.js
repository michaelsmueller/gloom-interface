import React, { createContext, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';

export const Web3Context = createContext();

export default function Web3ContextProvider({ children }) {
  const web3Context = useWeb3React();
  const { activate } = web3Context;
  useEffect(() => {
    const injectedConnector = new InjectedConnector({ supportedChainIds: [1, 3, 4, 13, 1337] });
    activate(injectedConnector);
  }, [activate]);
  return <Web3Context.Provider value={{ web3Context }}>{children}</Web3Context.Provider>;
}

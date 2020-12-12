import React, { createContext, useContext, useState, useEffect } from 'react';
import useContract from 'hooks/useContract';
import { Web3Context } from 'contexts/web3Context';
import AuctionFactory from 'contracts/AuctionFactory.json';

export const AuctionsContext = createContext();

export default function AuctionsContextProvider({ children }) {
  const { web3Context } = useContext(Web3Context);
  // const { active, error } = web3Context;
  const factoryContract = useContract(AuctionFactory, web3Context);
  // const [auctionAddresses] = useAuctions(factoryContract);
  const [auctionAddresses, setAuctionAddresses] = useState([]);

  const getAuctions = async () => {
    const response = await factoryContract.getAddresses();
    setAuctionAddresses(response);
  };

  useEffect(() => {
    if (!factoryContract) return;
    getAuctions();
  }, [factoryContract]);

  console.log('auctionsContext auctionAddresses', auctionAddresses);
  return <AuctionsContext.Provider value={{ auctionAddresses, getAuctions }}>{children}</AuctionsContext.Provider>;
}

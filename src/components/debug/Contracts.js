import React, { useContext, useEffect, useState } from 'react';
import useContract from 'hooks/useContract';
import { Web3Context } from 'contexts/web3Context';
import AuctionFactory from 'contracts/AuctionFactory.json';
import Auction from 'contracts/Auction.json';

export default function Contracts() {
  const { web3Context } = useContext(Web3Context);
  const { active, error } = web3Context;
  const factoryContract = useContract(AuctionFactory, web3Context);
  const logicContract = useContract(Auction, web3Context);
  const [auctionAddresses, setAuctionAddresses] = useState([]);

  useEffect(() => {
    if (!factoryContract) return;
    const getAuctions = async () => {
      const response = await factoryContract.getAddresses();
      setAuctionAddresses(response);
    };
    getAuctions();
  }, [active, error, factoryContract]);

  const { address: factoryAddress } = factoryContract || '';
  const { address: logicAddress } = logicContract || '';
  return (
    <pre>
      <li>AuctionFactory address: {factoryAddress}</li>
      <li>Auction (logic) address: {logicAddress}</li>
      {auctionAddresses.map((auctionAddress, index) => (
        <li key={auctionAddress}>
          Auction {index + 1}: {auctionAddress}
        </li>
      ))}
    </pre>
  );
}

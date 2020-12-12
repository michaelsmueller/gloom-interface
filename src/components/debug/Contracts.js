import React, { useContext } from 'react';
import useContract from 'hooks/useContract';
import useAuctionAddresses from 'hooks/useAuctionAddresses';
import { Web3Context } from 'contexts/web3Context';
import AuctionFactory from 'contracts/AuctionFactory.json';
import Auction from 'contracts/Auction.json';

export default function Contracts() {
  const { web3Context } = useContext(Web3Context);
  const factoryContract = useContract(AuctionFactory, web3Context);
  const logicContract = useContract(Auction, web3Context);
  const { auctionAddresses } = useAuctionAddresses(factoryContract);
  const { address: factoryAddress } = factoryContract || '';
  const { address: logicAddress } = logicContract || '';
  return (
    <pre>
      <li>AuctionFactory address: {factoryAddress}</li>
      <li>Auction (logic) address: {logicAddress}</li>
      <li>Auctions (deployed):</li>
      {auctionAddresses.map(auctionAddress => (
        <div key={auctionAddress}>[{auctionAddress}]</div>
      ))}
    </pre>
  );
}

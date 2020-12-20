import React from 'react';
import useDeployedContract from 'hooks/useDeployedContract';
import useAuctionAddresses from 'hooks/useAuctionAddresses';
import AuctionFactory from 'contracts/AuctionFactory.json';
import Auction from 'contracts/Auction.json';

export default function Contracts() {
  const factoryContract = useDeployedContract(AuctionFactory);
  const logicContract = useDeployedContract(Auction);
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

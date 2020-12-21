import React, { useContext, useEffect, useState } from 'react';
import useDeployedContract from 'hooks/useDeployedContract';
import { Web3Context } from 'contexts/web3Context';
import AuctionFactory from 'contracts/AuctionFactory.json';
import { BackButton, BidderPhaseSwitcher, AssetDetails } from 'components';

export default function BidderDashboard() {
  const { web3Context } = useContext(Web3Context);
  const { active, error } = web3Context;
  const factoryContract = useDeployedContract(AuctionFactory);
  const [auctionAddress, setAuctionAddress] = useState('');

  useEffect(() => {
    if (!active || !factoryContract) return;
    const getAuctionInvited = async () => {
      const auctionInvited = await factoryContract.getAuctionInvited();
      if (auctionInvited !== '0x0000000000000000000000000000000000000000') setAuctionAddress(auctionInvited);
    };
    getAuctionInvited();
  }, [active, factoryContract]);

  useEffect(() => {
    if (!active || !factoryContract) return null;
    factoryContract.on('LogBidderRegistered', auction => {
      setAuctionAddress(auction);
    });
    return () => factoryContract.removeAllListeners('LogBidderRegistered');
  });

  if (!active && !error) return <div>loading</div>;
  if (error) return <div>Error {error.message}</div>;

  return (
    <div>
      <BackButton />
      <h1>Bidder dashboard</h1>
      {auctionAddress ? (
        <>
          <AssetDetails auctionAddress={auctionAddress} />
          <BidderPhaseSwitcher auctionAddress={auctionAddress} />
        </>
      ) : (
        <div>You have no auction invites</div>
      )}
    </div>
  );
}

/* eslint-disable no-console */
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Contract } from '@ethersproject/contracts';
import { Web3Context } from 'contexts/web3Context';
import Auction from 'contracts/Auction.json';
import { BackButton, AuctionDateTimes } from 'components';
import { getSigner } from 'utils/web3Library';

export default function AuctionDetails() {
  const { id: auctionAddress } = useParams();
  const { web3Context } = useContext(Web3Context);
  const { active, error, library } = web3Context;
  const [auctionContract, setAuctionContract] = useState(null);
  const [auctionDateTimes, setAuctionDateTimes] = useState({});

  useEffect(() => {
    if (!active) return;
    const signer = getSigner(library);
    const auctionInstance = new Contract(auctionAddress, Auction.abi, signer);
    setAuctionContract(auctionInstance);
  }, [active, library, auctionAddress]);

  useEffect(() => {
    console.log('useEffect 2');
    if (!active || !auctionContract) return;
    console.log('active');
    const getDateTimes = async () => {
      console.log('getDateTimes');
      const dateTimes = await auctionContract.getDateTimes();
      setAuctionDateTimes({
        startDateTime: dateTimes[0].toNumber(),
        endDateTime: dateTimes[1].toNumber(),
      });
    };
    getDateTimes();
  }, [active, auctionContract]);

  if (!active && !error) return <div>loading</div>;
  if (error) return <div>error</div>;

  console.log('auctionDateTimes', auctionDateTimes);
  return (
    <div>
      <BackButton />
      <h1>Auction details</h1>
      <AuctionDateTimes auctionDateTimes={auctionDateTimes} />
      <pre>
        Auction contract: {auctionAddress}
        <br />
        {JSON.stringify(auctionContract, null, 2)}
      </pre>
    </div>
  );
}

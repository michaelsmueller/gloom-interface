/* eslint-disable no-console */
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useContract from 'hooks/useContract';
import { Web3Context } from 'contexts/web3Context';
import Auction from 'contracts/Auction.json';
import { BackButton, AuctionDateTimes } from 'components';
import Button from 'styles/buttonStyles';

export default function AuctionDetails() {
  const { id: auctionAddress } = useParams();
  const { web3Context } = useContext(Web3Context);
  const { active, error } = web3Context;
  const auctionContract = useContract(Auction, web3Context, auctionAddress);
  const [auctionDateTimes, setAuctionDateTimes] = useState({});
  const [winner, setWinner] = useState('');

  useEffect(() => {
    if (!active || !auctionContract) return;
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

  useEffect(() => {
    console.log('listening for LogSetWinner event');
    if (!active || !auctionContract) return null;
    auctionContract.on('LogSetWinner', bidder => {
      console.log('LogSetWinner event, winner', bidder);
      setWinner(bidder);
    });
    return () => auctionContract.removeAllListeners('LogSetWinner');
  });

  const startCommit = () => auctionContract.startCommit();
  const startReveal = () => auctionContract.startReveal();
  const startDeliver = () => auctionContract.startDeliver();
  const startWithdraw = () => auctionContract.startWithdraw();

  if (!active && !error) return <div>loading</div>;
  if (error) return <div>error</div>;

  console.log('auctionDateTimes', auctionDateTimes);
  return (
    <div>
      <BackButton />
      <h1>Auction details</h1>
      <AuctionDateTimes auctionDateTimes={auctionDateTimes} />
      <h2>Winner</h2>
      <pre>
        <ul>
          <li>{winner || 'pending'}</li>
        </ul>
      </pre>
      <Button type='button' onClick={startCommit}>
        Start commit
      </Button>
      <Button type='button' onClick={startReveal}>
        Start reveal
      </Button>
      <Button type='button' onClick={startDeliver}>
        Start deliver
      </Button>
      <Button type='button' onClick={startWithdraw}>
        Start withdraw
      </Button>
      <pre>
        Auction contract: {auctionAddress}
        <br />
        {JSON.stringify(auctionContract, null, 2)}
      </pre>
    </div>
  );
}

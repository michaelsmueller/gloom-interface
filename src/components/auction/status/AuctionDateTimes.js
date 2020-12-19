import React, { useContext, useEffect, useState } from 'react';
import useContract from 'hooks/useContract';
import { Web3Context } from 'contexts/web3Context';
import Auction from 'contracts/Auction.json';
import { calculateTimeLeft, showLocalDateTime } from 'utils/dateTime';

export default function AuctionDateTimes({ auctionAddress }) {
  const { web3Context } = useContext(Web3Context);
  const auctionContract = useContract(Auction, web3Context, auctionAddress);
  const [auctionDateTimes, setAuctionDateTimes] = useState({});
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(''));

  useEffect(() => {
    if (!auctionContract) return;
    const getDateTimes = async () => {
      const dateTimes = await auctionContract.getDateTimes();
      setAuctionDateTimes({
        startDateTime: dateTimes[0].toNumber(),
        endDateTime: dateTimes[1].toNumber(),
      });
    };
    getDateTimes();
  }, [auctionContract]);

  useEffect(() => {
    const { endDateTime } = auctionDateTimes || '';
    const timer = setTimeout(() => setTimeLeft(calculateTimeLeft(endDateTime)), 1000);
    return () => clearTimeout(timer);
  });

  const timerComponents = [];
  Object.keys(timeLeft).forEach(interval => {
    if (!timeLeft[interval]) return;
    timerComponents.push(
      <span key={interval}>
        {timeLeft[interval]} {interval}{' '}
      </span>,
    );
  });

  const { startDateTime, endDateTime } = auctionDateTimes || '';
  return (
    <>
      <h2>Auction dates & times</h2>
      <pre>
        <ul>
          {/* <li>Now: {showLocalDateTime(now)}</li> */}
          <li>Start date & time:&nbsp; {showLocalDateTime(startDateTime)}</li>
          <li>End date & time:&nbsp; {showLocalDateTime(endDateTime)}</li>
          <li>Time left:&nbsp; {timerComponents || <span>Auction ended!</span>}</li>
        </ul>
      </pre>
    </>
  );
}

/* eslint-disable no-console */
import React, { useEffect, useState } from 'react';
import { calculateTimeLeft, showLocalDateTime } from 'utils/dateTime';

export default function AuctionDateTimes({ auctionDateTimes }) {
  const { startDateTime, endDateTime } = auctionDateTimes;
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(endDateTime));

  useEffect(() => {
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

  // console.log(`timeLeft, ${JSON.stringify(timeLeft, null, 2)}`);
  return (
    <>
      <h2>Auction dates & times</h2>
      <pre>
        <ul>
          {/* <li>Now: {showLocalDateTime(now)}</li> */}
          <li>Start date & time:&nbsp; {showLocalDateTime(startDateTime)}</li>
          <li>End date & time:&nbsp; {showLocalDateTime(endDateTime)}</li>
          <li>Time left: </li>
          {timerComponents.length ? timerComponents : <span>Time is up!</span>}
        </ul>
      </pre>
    </>
  );
}

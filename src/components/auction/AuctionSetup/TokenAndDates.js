/* eslint-disable no-console */
import React, { useContext } from 'react';
import useContract from 'hooks/useContract';
import { Web3Context } from 'contexts/web3Context';
import AuctionFactory from 'contracts/AuctionFactory.json';
import Auction from 'contracts/Auction.json';
import { parseLocalDateTime, getLocalDateTime } from 'utils/dateTime';
import { TokenAndDatesForm } from 'components';

export default function TokenAndDates() {
  const { web3Context } = useContext(Web3Context);
  const factoryContract = useContract(AuctionFactory, web3Context);
  const logicContract = useContract(Auction, web3Context);

  const createAuction = async ({ amount, token, startDate, endDate }) => {
    const tx = await factoryContract.createAuction(logicContract.address, amount, token, startDate, endDate);
    const receipt = await tx.wait();
    console.log('tx', tx);
    console.log('receipt', receipt);
    factoryContract.on('LogAuctionCreated', event => console.log('TokenAndDates AuctionCreated event', event));
  };

  const setupAuction = ({ amount, token, startDate, endDate }) => {
    const data = {
      amount,
      token,
      startDate: parseLocalDateTime(startDate),
      endDate: parseLocalDateTime(endDate),
    };
    console.log('parsed data sent to createAuction', data);
    console.log('checking parsed startDate', getLocalDateTime(data.startDate));
    console.log('checking parsed endDate', getLocalDateTime(data.endDate));
    createAuction(data);
  };

  return (
    <div>
      <TokenAndDatesForm onSubmit={setupAuction} />
    </div>
  );
}

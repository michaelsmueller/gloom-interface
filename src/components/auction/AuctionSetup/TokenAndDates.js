/* eslint-disable no-console */
import React, { useContext, useState } from 'react';
import useContract from 'hooks/useContract';
import { Web3Context } from 'contexts/web3Context';
import AuctionFactory from 'contracts/AuctionFactory.json';
import Auction from 'contracts/Auction.json';
import { parseLocalDateTime, getLocalDateTime } from 'utils/dateTime';
import { TokenAndDatesForm } from 'components';

import LoadingOverlay from 'react-loading-overlay';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function TokenAndDates() {
  const { web3Context } = useContext(Web3Context);
  const factoryContract = useContract(AuctionFactory, web3Context);
  const logicContract = useContract(Auction, web3Context);

  const [isLoading, setIsLoading] = useState(false);

  const createAuction = async ({ amount, token, startDate, endDate }) => {
    setIsLoading(true);
    try {
      await factoryContract.createAuction(logicContract.address, amount, token, startDate, endDate);
      toast.info('Submitted transaction to create auction ');
      factoryContract.once('error', error => toast.error(`Error creating auction: ${error.message}`));
      factoryContract.once('LogAuctionCreated', event => toast.success(`Auction created: ${event}`));
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    }
    setIsLoading(false);
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
      <LoadingOverlay active={isLoading} spinner text='Waiting for transaction'>
        <TokenAndDatesForm onSubmit={setupAuction} />
        <ToastContainer position='bottom-right' newestOnTop />
      </LoadingOverlay>
    </div>
  );
}

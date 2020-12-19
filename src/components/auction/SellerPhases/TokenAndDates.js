import React, { useContext } from 'react';
import useContract from 'hooks/useContract';
import { LoadingContext } from 'contexts/loadingContext';
import AuctionFactory from 'contracts/AuctionFactory.json';
import Auction from 'contracts/Auction.json';
import { parseLocalDateTime } from 'utils/dateTime';
import { TokenAndDatesForm } from 'components';
import { toast } from 'react-toastify';

export default function TokenAndDates() {
  const factoryContract = useContract(AuctionFactory);
  const logicContract = useContract(Auction);
  const { setIsLoading } = useContext(LoadingContext);

  const createAuction = async ({ amount, token, startDate, endDate }) => {
    setIsLoading(true);
    try {
      await factoryContract.createAuction(logicContract.address, amount, token, startDate, endDate);
      toast.info('Submitted transaction to create auction ');
      factoryContract.once('error', error =>
        toast.error(`Error creating auction: ${error.data?.message || error.message}`),
      );
      factoryContract.once('LogAuctionCreated', (auction, seller) =>
        toast.success(`Auction ${auction} created by ${seller}`),
      );
    } catch (error) {
      toast.error(`Error: ${error.data?.message || error.message}`);
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
    createAuction(data);
  };

  return <TokenAndDatesForm onSubmit={setupAuction} />;
}

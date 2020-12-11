/* eslint-disable no-console */
import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import useContract from 'hooks/useContract';
import { Web3Context } from 'contexts/web3Context';
import AuctionFactory from 'contracts/AuctionFactory.json';
import Auction from 'contracts/Auction.json';
import { parseLocalDateTime, getLocalDateTime } from 'utils/dateTime';
import { BackButton, AuctionSetupForm } from 'components';
import Button from 'styles/buttonStyles';

export default function AuctionSetup() {
  const history = useHistory();
  const { web3Context } = useContext(Web3Context);
  const { active, error } = web3Context;
  const factoryContract = useContract(AuctionFactory, web3Context);
  const logicContract = useContract(Auction, web3Context);
  const [auctionAddresses, setAuctionAddresses] = useState([]);

  if (!active && !error) return <div>loading</div>;
  if (error) return <div>Error {error.message}</div>;

  const createAuction = async ({ amount, token, startDate, endDate }) => {
    const tx = await factoryContract.createAuction(logicContract.address, amount, token, startDate, endDate);
    const receipt = await tx.wait();
    console.log('tx', tx);
    console.log('receipt', receipt);
    factoryContract.on('LogAuctionCreated', event => console.log('AuctionCreated event', event));
    factoryContract.once(tx, transaction => {
      console.log('transaction mined', transaction);
      // getAuctions();
    });
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
    // console.log('difference between two dates', data.endDate - data.startDate);
    createAuction(data);
  };

  const goToSellerDeposit = () => history.push(`/auctions/${auctionAddresses[0]}/seller-deposit`);

  // const { address: factoryAddress } = factoryContract || '';
  // const { address: logicAddress } = logicContract || '';
  return (
    <div>
      {/* <pre>factory address: {factoryAddress}</pre>
      <pre>logic contract address: {logicAddress}</pre>
      <pre>
        Auction addresses:
        <br />
        {JSON.stringify(auctionAddresses, null, 2)}
      </pre>
      <br />
      <hr /> */}

      <BackButton />
      <h1>Set up auction</h1>
      <AuctionSetupForm onSubmit={setupAuction} />
      {auctionAddresses.length ? (
        <Button type='button' onClick={goToSellerDeposit}>
          Make deposit
        </Button>
      ) : null}
    </div>
  );
}

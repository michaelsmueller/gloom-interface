/* eslint-disable no-console */
import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Contract } from '@ethersproject/contracts';
import { Web3Context } from '../contexts/web3Context';
import AuctionFactory from '../contracts/AuctionFactory.json';
import { AuctionSetupForm } from '.';
import Button from '../styles/buttonStyles';
import { getSigner } from '../utils/web3Library';
import { parseLocalDateTime, getLocalDateTime } from '../utils/dateTime';

export default function AuctionSetup() {
  const history = useHistory();
  const { web3Context } = useContext(Web3Context);
  const { account, active, error, library, chainId } = web3Context;
  const [factoryContract, setFactoryContract] = useState(null);
  const [auctionAddresses, setAuctionAddresses] = useState([]);

  if (!active && !error) return <div>loading</div>;
  if (error) return <div>Error {error.message}</div>;

  const signer = getSigner(library);

  const instantiateFactory = () => {
    const { networks, abi } = AuctionFactory;
    const { address } = networks[chainId];
    const factoryInstance = new Contract(address, abi, signer);
    setFactoryContract(factoryInstance);
  };

  const getAuctions = async () => {
    const response = await factoryContract.getAddresses();
    setAuctionAddresses(response);
  };

  const createAuction = async ({ amount, token, startDate, endDate }) => {
    const tx = await factoryContract.createAuction(amount, token, startDate, endDate, account);
    const receipt = await tx.wait();
    console.log('tx', tx);
    console.log('receipt', receipt);
    factoryContract.on('AuctionCreated', event => console.log('AuctionCreated event', event));
    factoryContract.once(tx, transaction => {
      console.log('transaction mined', transaction);
      getAuctions();
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

  const { address } = factoryContract || '';
  return (
    <div>
      <h2>Auction Factory</h2>
      <Button type='button' onClick={instantiateFactory}>
        Instantiate factory
      </Button>
      <Button type='button' onClick={getAuctions}>
        Get auction addresses
      </Button>
      <pre>factory address: {address}</pre>
      <pre>
        Auction addresses:
        <br />
        {JSON.stringify(auctionAddresses, null, 2)}
      </pre>
      <br />
      <hr />

      <h2>Set up auction</h2>
      <AuctionSetupForm onSubmit={setupAuction} />
      {auctionAddresses.length ? (
        <Button type='button' onClick={() => history.push(`/auctions/${auctionAddresses[0]}/seller-deposit`)}>
          Make deposit
        </Button>
      ) : null}
    </div>
  );
}

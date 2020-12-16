/* eslint-disable no-console */
import React, { useContext, useEffect, useState } from 'react';
import Auction from 'contracts/Auction.json';
import { Contract } from '@ethersproject/contracts';
import { formatUnits, parseEther } from '@ethersproject/units';
import { Web3Context } from 'contexts/web3Context';
import { getSigner } from 'utils/web3Library';
import { SellerDepositForm } from 'components';

export default function SellerDeposit({ auctionAddress }) {
  const { web3Context } = useContext(Web3Context);
  const { account, active, error, library } = web3Context;
  const [auctionContract, setAuctionContract] = useState(null);

  useEffect(() => {
    if (!active) return;
    const signer = getSigner(library);
    const auctionInstance = new Contract(auctionAddress, Auction.abi, signer);
    setAuctionContract(auctionInstance);
  }, [active, library, auctionAddress]);

  if (!active && !error) return <div>loading</div>;
  if (error) return <div>error</div>;

  const fundDeposit = async ({ sellerDeposit }) => {
    const overrides = { from: account, value: parseEther(sellerDeposit) };
    await auctionContract.receiveSellerDeposit(overrides);
    auctionContract.on('LogSellerDepositReceived', (seller, deposit) => {
      console.log('ReceiveSellerDeposit event, seller', seller);
      console.log('ReceiveSellerDeposit event, sellerDeposit', formatUnits(deposit));
    });
  };

  return (
    <div>
      <SellerDepositForm onSubmit={fundDeposit} />
    </div>
  );
}

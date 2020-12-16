/* eslint-disable no-console */
import React, { useContext, useEffect, useState } from 'react';
// import { useHistory } from 'react-router-dom';
// import AuctionFactory from 'contracts/AuctionFactory.json';
// import { Contract } from '@ethersproject/contracts';
import { Web3Context } from 'contexts/web3Context';
// import { getSigner } from 'utils/web3Library';
import { TokenAndDates, SellerDeposit, BidderInvites } from 'components';
import Button from 'styles/buttonStyles';

export default function AuctionSetup({ auctionAddress }) {
  // const history = useHistory();
  const { web3Context } = useContext(Web3Context);
  const { active, error, library, chainId } = web3Context;
  // const [factoryContract, setFactoryContract] = useState(null);
  // const [auctionAddress, setAuctionAddress] = useState('');
  const [showing, setShowing] = useState('TOKEN_AND_DATES');

  // useEffect(() => {
  //   if (!active) return;
  //   const signer = getSigner(library);
  //   const { address } = AuctionFactory.networks[chainId];
  //   const factoryInstance = new Contract(address, AuctionFactory.abi, signer);
  //   setFactoryContract(factoryInstance);
  // }, [active, library, chainId]);

  // useEffect(() => {
  //   if (!active || !factoryContract) return;
  //   const getAuction = async () => {
  //     const auction = await factoryContract.getAuctionBy();
  //     if (auction !== '0x0000000000000000000000000000000000000000') setAuctionAddress(auction);
  //   };
  //   getAuction();
  // }, [active, factoryContract]);

  if (!active && !error) return <div>loading</div>;
  if (error) return <div>Error {error.message}</div>;

  // const goToTokenAndDates = () => history.push('/auctions/new');
  // const goToAuctionDetails = () => history.push(`/auctions/${auctionAddress}`);

  return (
    <div>
      <h1>Auction</h1>
      {/* <Button type='button' onClick={goToTokenAndDates}>
        New auction
      </Button>
      {auctionAddress && (
        <div>
          <pre>{auctionAddress}</pre>
          <Button type='button' onClick={goToAuctionDetails}>
            View auction
          </Button>
        </div>
      )} */}
      <TopNav showing={showing} setShowing={setShowing} />
      {showing === 'TOKEN_AND_DATES' && <TokenAndDates />}
      {showing === 'SELLER_DEPOSIT' && <SellerDeposit auctionAddress={auctionAddress} />}
      {showing === 'BIDDER_INVITES' && <BidderInvites auctionAddress={auctionAddress} />}
    </div>
  );
}

const TopNav = ({ showing, setShowing, user }) => {
  const handleClick = e => setShowing(e.target.value);
  // const { partner } = user || '';
  const highlighted = { fontWeight: 600, borderBottom: '2px solid #ee2B7a' };
  const setupButtonStyle = showing === 'TOKEN_AND_DATES' ? highlighted : null;
  const depositButtonStyle = showing === 'SELLER_DEPOSIT' ? highlighted : null;
  const biddersButtonStyle = showing === 'BIDDER_INVITES' ? highlighted : null;
  // const redeemedButtonStyle = showing === 'redeemed' ? highlighted : null;
  return (
    <div className='offers-coupons-buttons'>
      {/* <button>Add</button> */}
      <button type='button' style={setupButtonStyle} onClick={handleClick} value='TOKEN_AND_DATES'>
        Token & Dates
      </button>
      <button type='button' style={depositButtonStyle} onClick={handleClick} value='SELLER_DEPOSIT'>
        Deposit
      </button>
      <button type='button' style={biddersButtonStyle} onClick={handleClick} value='BIDDER_INVITES'>
        Bidders
      </button>
      {/* {partner && <button style={scanButtonStyle} onClick={handleClick} value='scan'>Scan</button>}
      {partner && <button style={redeemedButtonStyle} onClick={handleClick} value='redeemed'>Redeemed</button>} */}
    </div>
  );
};

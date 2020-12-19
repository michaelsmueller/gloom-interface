/* eslint-disable no-console */
import React, { useContext, useState } from 'react';
// import { Web3Context } from 'contexts/web3Context';
import { TokenAndDates, SellerDeposit, BidderInvites } from 'components';
import NavBar from 'styles/navStyles';
import { toast } from 'react-toastify';

export default function SellerPhaseSwitcher({ auctionAddress }) {
  // const { web3Context } = useContext(Web3Context);
  // const { active, error } = web3Context;
  const [showing, setShowing] = useState('TOKEN_AND_DATES');

  // if (!active && !error) return <div>loading</div>;
  // if (error) return <div>Error {error.message}</div>;

  return (
    <div>
      <h2>Auction</h2>
      <SellerNav showing={showing} setShowing={setShowing} auctionAddress={auctionAddress} />
      {showing === 'TOKEN_AND_DATES' && <TokenAndDates />}
      {showing === 'SELLER_DEPOSIT' && <SellerDeposit auctionAddress={auctionAddress} />}
      {showing === 'BIDDER_INVITES' && <BidderInvites auctionAddress={auctionAddress} />}
    </div>
  );
}

const SellerNav = ({ showing, setShowing, auctionAddress }) => {
  const handleClick = e => {
    if (auctionAddress) setShowing(e.target.value);
    else toast.warning('Enter token and dates, click Set up auction and wait for auction to be created.');
  };
  // const { partner } = user || '';
  const highlighted = { fontWeight: 600, borderBottom: '2px solid #ee2B7a' };
  const setupButtonStyle = showing === 'TOKEN_AND_DATES' ? highlighted : null;
  const depositButtonStyle = showing === 'SELLER_DEPOSIT' ? highlighted : null;
  const biddersButtonStyle = showing === 'BIDDER_INVITES' ? highlighted : null;
  // const redeemedButtonStyle = showing === 'redeemed' ? highlighted : null;
  return (
    <NavBar>
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
      {/* {partner && <button style={redeemedButtonStyle} onClick={handleClick} value='redeemed'>Redeemed</button>} */}
    </NavBar>
  );
};
